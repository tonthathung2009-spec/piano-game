const express = require('express');
const http = require('http');
const crypto = require('crypto');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const WIDTH = 1200;
const HEIGHT = 700;
const PLAYER_RADIUS = 18;
const SPEED = 210;
const PASS_RANGE = 112;
const ROUND_SECONDS = 10;
const rooms = new Map();

app.use(express.static('public'));
app.get('/health', (_req, res) => res.json({ ok: true, rooms: rooms.size }));

const obstacles = [
  { x: 0, y: 0, w: WIDTH, h: 24, kind: 'wall' },
  { x: 0, y: HEIGHT - 24, w: WIDTH, h: 24, kind: 'wall' },
  { x: 0, y: 0, w: 24, h: HEIGHT, kind: 'wall' },
  { x: WIDTH - 24, y: 0, w: 24, h: HEIGHT, kind: 'wall' },
  { x: 260, y: 126, w: 170, h: 32, kind: 'wall' },
  { x: 750, y: 108, w: 190, h: 32, kind: 'wall' },
  { x: 455, y: 520, w: 250, h: 32, kind: 'wall' },
  { x: 126, y: 300, w: 38, h: 170, kind: 'wall' },
  { x: 1010, y: 260, w: 38, h: 190, kind: 'wall' },
  { x: 510, y: 240, w: 180, h: 34, kind: 'wall' },
  { x: 150, y: 120, w: 100, h: 92, kind: 'crate' },
  { x: 930, y: 500, w: 108, h: 82, kind: 'crate' },
  { x: 485, y: 350, w: 75, h: 55, kind: 'crate' },
  { x: 745, y: 350, w: 78, h: 55, kind: 'crate' },
  { x: 315, y: 410, w: 95, h: 50, kind: 'crate' },
  { x: 780, y: 180, w: 70, h: 62, kind: 'tree' },
  { x: 365, y: 205, w: 70, h: 62, kind: 'tree' },
  { x: 185, y: 515, w: 70, h: 62, kind: 'tree' },
  { x: 840, y: 450, w: 70, h: 62, kind: 'tree' },
  { x: 575, y: 70, w: 130, h: 90, kind: 'water' }
];

function code() { return crypto.randomBytes(3).toString('hex').toUpperCase(); }
function safeRoomCode() { let c; do c = code(); while (rooms.has(c)); return c; }
function cleanName(name) { return String(name || 'Player').trim().slice(0, 16) || 'Player'; }
function publicState(room) {
  return { code: room.code, hostId: room.hostId, state: room.state, players: [...room.players.values()].map(p => ({ id:p.id, name:p.name, x:Math.round(p.x), y:Math.round(p.y), color:p.color, ready:p.ready, alive:p.alive, hasBomb:p.id === room.bombHolder })), bombHolder: room.bombHolder, timeLeft: room.timerEnd ? Math.max(0, (room.timerEnd - Date.now()) / 1000) : 0, winnerId: room.winnerId || null };
}
function emitRoom(room) { io.to(room.code).emit('state', publicState(room)); }
function spawn(i) {
  const spots = [{x:80,y:80},{x:1120,y:80},{x:80,y:620},{x:1120,y:620},{x:220,y:260},{x:950,y:220},{x:220,y:475},{x:950,y:600},{x:450,y:90},{x:730,y:610}];
  const s = spots[i % spots.length]; return { x:s.x, y:s.y };
}
function hitsObstacle(x, y) {
  return obstacles.some(o => {
    const nx = Math.max(o.x, Math.min(x, o.x + o.w));
    const ny = Math.max(o.y, Math.min(y, o.y + o.h));
    return Math.hypot(x - nx, y - ny) < PLAYER_RADIUS;
  });
}
function movePlayer(p, dt) {
  if (!p.alive) return;
  const dx = (p.input.right ? 1 : 0) - (p.input.left ? 1 : 0);
  const dy = (p.input.down ? 1 : 0) - (p.input.up ? 1 : 0);
  const len = Math.hypot(dx, dy) || 1;
  const nx = Math.max(PLAYER_RADIUS + 24, Math.min(WIDTH - PLAYER_RADIUS - 24, p.x + dx / len * SPEED * dt));
  const ny = Math.max(PLAYER_RADIUS + 24, Math.min(HEIGHT - PLAYER_RADIUS - 24, p.y + dy / len * SPEED * dt));
  if (!hitsObstacle(nx, p.y)) p.x = nx;
  if (!hitsObstacle(p.x, ny)) p.y = ny;
}
function alivePlayers(room) { return [...room.players.values()].filter(p => p.alive); }
function chooseBomb(room) { const a = alivePlayers(room); room.bombHolder = a.length ? a[Math.floor(Math.random() * a.length)].id : null; room.timerEnd = Date.now() + ROUND_SECONDS * 1000; }
function finishWinner(room, winner) {
  room.state = 'winner'; room.winnerId = winner ? winner.id : null; room.bombHolder = null; room.timerEnd = null;
  io.to(room.code).emit('winner', { id: room.winnerId, name: winner ? winner.name : 'Nobody' }); emitRoom(room);
}
function eliminate(room, id) {
  const p = room.players.get(id); if (!p || !p.alive) return;
  p.alive = false; if (room.bombHolder === id) room.bombHolder = null;
  io.to(room.code).emit('explosion', { id, x:p.x, y:p.y, name:p.name });
  const a = alivePlayers(room);
  if (a.length <= 1) return setTimeout(() => finishWinner(room, a[0]), 900);
  setTimeout(() => { if (room.state !== 'playing') return; chooseBomb(room); emitRoom(room); }, 1200);
  emitRoom(room);
}
function startGame(room) {
  if (room.players.size < 4 || room.state !== 'lobby') return;
  const list = [...room.players.values()];
  list.forEach((p, i) => { p.alive = true; p.ready = true; Object.assign(p, spawn(i)); });
  room.state = 'playing'; room.winnerId = null; chooseBomb(room); io.to(room.code).emit('gameStarted'); emitRoom(room);
}
function removeFromRoom(socket, announce = true) {
  const room = socket.roomCode && rooms.get(socket.roomCode); if (!room) return;
  const removed = room.players.get(socket.id); room.players.delete(socket.id);
  if (room.hostId === socket.id) room.hostId = room.players.keys().next().value || null;
  if (room.state === 'playing' && removed && removed.alive) {
    if (room.bombHolder === socket.id) room.bombHolder = null;
    const a = alivePlayers(room);
    if (a.length <= 1) finishWinner(room, a[0]); else if (!room.bombHolder) chooseBomb(room);
  }
  if (!room.players.size) rooms.delete(room.code); else if (announce) emitRoom(room);
  socket.leave(room.code); socket.roomCode = null;
}

setInterval(() => {
  const now = Date.now();
  for (const room of rooms.values()) {
    if (room.state === 'playing') {
      for (const p of room.players.values()) movePlayer(p, 0.05);
      if (room.timerEnd && now >= room.timerEnd && room.bombHolder) eliminate(room, room.bombHolder);
      io.to(room.code).emit('state', publicState(room));
    }
  }
}, 50);

io.on('connection', socket => {
  socket.on('createRoom', ({ name }, reply) => {
    if (socket.roomCode) removeFromRoom(socket, false);
    const room = { code:safeRoomCode(), hostId:socket.id, players:new Map(), state:'lobby', bombHolder:null, timerEnd:null, winnerId:null };
    rooms.set(room.code, room); join(socket, room, name); reply({ ok:true, code:room.code });
  });
  socket.on('joinRoom', ({ name, code }, reply) => {
    const room = rooms.get(String(code || '').trim().toUpperCase());
    if (!room) return reply({ ok:false, error:'Room not found.' });
    if (room.state !== 'lobby') return reply({ ok:false, error:'This game has already started.' });
    if (room.players.size >= 20) return reply({ ok:false, error:'Room is full (20 players).' });
    if (socket.roomCode) removeFromRoom(socket, false);
    join(socket, room, name); reply({ ok:true, code:room.code });
  });
  socket.on('toggleReady', () => { const r=rooms.get(socket.roomCode), p=r?.players.get(socket.id); if (r && p && r.state==='lobby') { p.ready=!p.ready; emitRoom(r); } });
  socket.on('startGame', () => { const r=rooms.get(socket.roomCode); if (r && r.hostId===socket.id && [...r.players.values()].every(p=>p.ready)) startGame(r); });
  socket.on('input', input => { const r=rooms.get(socket.roomCode), p=r?.players.get(socket.id); if (p && r.state==='playing') p.input={up:!!input.up,down:!!input.down,left:!!input.left,right:!!input.right}; });
  socket.on('passBomb', () => {
    const r=rooms.get(socket.roomCode), p=r?.players.get(socket.id); if (!r || r.state!=='playing' || !p || r.bombHolder!==socket.id || !p.alive) return;
    const target = alivePlayers(r).filter(q=>q.id!==p.id).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
    if (!target || Math.hypot(target.x-p.x,target.y-p.y)>PASS_RANGE) return;
    r.bombHolder=target.id; io.to(r.code).emit('pass', { from:p.id, to:target.id }); emitRoom(r);
  });
  socket.on('playAgain', () => { const r=rooms.get(socket.roomCode); if (!r || r.hostId!==socket.id || r.state!=='winner') return; r.state='lobby'; r.winnerId=null; for (const p of r.players.values()) { p.ready=false; p.alive=true; } emitRoom(r); });
  socket.on('disconnect', () => removeFromRoom(socket));
});
function join(socket, room, name) { const p={id:socket.id,name:cleanName(name),x:100,y:100,color:`hsl(${Math.floor(Math.random()*360)}, 78%, 62%)`,ready:false,alive:true,input:{}}; room.players.set(socket.id,p); socket.join(room.code); socket.roomCode=room.code; emitRoom(room); }
server.listen(PORT, () => console.log(`BOM RELAY running at http://localhost:${PORT}`));
