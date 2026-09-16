const socket = io();
const $ = id => document.getElementById(id);
let me = null, room = null, keys = {}, effects = [], audio;
const canvas = $('canvas'), ctx = canvas.getContext('2d');
const colors = ['#ff6b6b','#5f8dff','#f6b73c','#8d6bdb','#35b68a','#f084c2'];
function screen(id){ document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active')); $(id).classList.add('active'); }
function sound(type){ try { audio ||= new (window.AudioContext||window.webkitAudioContext)(); const o=audio.createOscillator(), g=audio.createGain(); o.connect(g);g.connect(audio.destination); const now=audio.currentTime; o.frequency.value=type==='pass'?520:type==='tick'?170:type==='boom'?70:420; o.type=type==='boom'?'sawtooth':'sine'; g.gain.setValueAtTime(.001,now);g.gain.exponentialRampToValueAtTime(type==='boom'?.3:.08,now+.01);g.gain.exponentialRampToValueAtTime(.001,now+(type==='boom'?.55:.13));o.start(now);o.stop(now+.6); }catch(e){} }
function name(){return $('name').value.trim()||'Player'}
$('showJoin').onclick=()=>{$('joinBox').classList.toggle('hidden');$('roomCode').focus()};
$('create').onclick=()=>socket.emit('createRoom',{name:name()},result);
$('join').onclick=()=>socket.emit('joinRoom',{name:name(),code:$('roomCode').value},result);
$('roomCode').onkeydown=e=>{if(e.key==='Enter')$('join').click()};
function result(r){if(!r.ok){$('homeError').textContent=r.error;return} $('homeError').textContent=''; $('roomCodeLabel').textContent=r.code; $('gameRoom').textContent=r.code;screen('lobby')}
$('ready').onclick=()=>socket.emit('toggleReady');
$('start').onclick=()=>socket.emit('startGame');
$('copyCode').onclick=()=>{navigator.clipboard?.writeText(room.code);$('copyCode').textContent='COPIED!';setTimeout(()=>$('copyCode').textContent='COPY CODE',1200)};
$('playAgain').onclick=()=>socket.emit('playAgain');
$('backHome').onclick=()=>{location.reload()};
window.onkeydown=e=>{const k=e.key.toLowerCase();if(['w','a','s','d'].includes(k)){keys[k]=true;e.preventDefault()}if(k==='e'&&!e.repeat){socket.emit('passBomb');sound('pass')}};
window.onkeyup=e=>{if(['w','a','s','d'].includes(e.key.toLowerCase()))keys[e.key.toLowerCase()]=false};
setInterval(()=>socket.emit('input',{up:keys.w,down:keys.s,left:keys.a,right:keys.d}),50);
socket.on('connect',()=>{$('connection').textContent='● ONLINE';$('connection').style.color='#32a05d'});
socket.on('state',s=>{room=s; if(s.state==='lobby'){screen('lobby');renderLobby(s)}else if(s.state==='playing'){screen('game');renderGame(s)}else if(s.state==='winner'){renderGame(s);showWinner(s)}});
socket.on('gameStarted',()=>{effects=[];screen('game')});
socket.on('pass',e=>{sound('pass');effects.push({type:'pass',life:1,from:e.from,to:e.to})});
socket.on('explosion',e=>{sound('boom');effects.push({type:'boom',x:e.x,y:e.y,life:1}); if(e.id===socket.id) toast('YOU GOT BOMBED! Spectating...'); else toast(`${e.name} was eliminated!`)});
function renderLobby(s){$('roomCodeLabel').textContent=s.code;const mine=s.players.find(p=>p.id===socket.id);$('ready').textContent=mine?.ready?'NOT READY':'I\'M READY';$('start').disabled=s.hostId!==socket.id||s.players.length<4||!s.players.every(p=>p.ready);$('start').textContent=s.players.length<4?`NEED ${4-s.players.length} MORE`:'START GAME';$('lobbyMessage').textContent=s.hostId===socket.id?'You are host. All players must be ready to start.':'Waiting for the host to start...';$('playerList').innerHTML=s.players.map((p,i)=>`<div class="player-row"><i class="dot" style="background:${p.color||colors[i%colors.length]}"></i>${escapeHtml(p.name)} ${p.id===socket.id?'(you)':''}<span class="${p.ready?'ready-tag':'host'}">${p.id===s.hostId?'HOST':p.ready?'READY':'WAITING'}</span></div>`).join('')}
function renderGame(s){$('gameRoom').textContent=s.code;$('alive').textContent=s.players.filter(p=>p.alive).length;const t=Math.max(0,s.timeLeft);$('timer').textContent=t.toFixed(1);$('timer').classList.toggle('danger',t<3);$('gameStatus').textContent=s.bombHolder===socket.id?'YOU HAVE THE BOMB — PASS IT!':'Stay close to players to relay';draw(s)}
function draw(s){ctx.clearRect(0,0,1200,700);ctx.fillStyle='#a9d77a';ctx.fillRect(0,0,1200,700);drawMap();for(const p of s.players)drawPlayer(p,s);effects=effects.filter(e=>e.life>0);for(const e of effects){e.life-=.05;if(e.type==='boom')drawBoom(e);if(e.type==='pass')drawPass(e,s)}requestAnimationFrame(()=>{})}
function drawMap(){ctx.fillStyle='#c8e99b';ctx.fillRect(25,25,1150,650);ctx.fillStyle='#70c9d1';ctx.beginPath();ctx.ellipse(640,115,65,43,0,0,7);ctx.fill();const blocks=[...window.mapObstacles||[]]; if(!blocks.length){mapBlocks.forEach(o=>block(o))}else blocks.forEach(block)}
const mapBlocks=[{x:260,y:126,w:170,h:32,k:'wall'},{x:750,y:108,w:190,h:32,k:'wall'},{x:455,y:520,w:250,h:32,k:'wall'},{x:126,y:300,w:38,h:170,k:'wall'},{x:1010,y:260,w:38,h:190,k:'wall'},{x:510,y:240,w:180,h:34,k:'wall'},{x:150,y:120,w:100,h:92,k:'crate'},{x:930,y:500,w:108,h:82,k:'crate'},{x:485,y:350,w:75,h:55,k:'crate'},{x:745,y:350,w:78,h:55,k:'crate'},{x:315,y:410,w:95,h:50,k:'crate'},{x:780,y:180,w:70,h:62,k:'tree'},{x:365,y:205,w:70,h:62,k:'tree'},{x:185,y:515,w:70,h:62,k:'tree'},{x:840,y:450,w:70,h:62,k:'tree'}];
function block(o){ctx.fillStyle=o.k==='wall'?'#a57b52':o.k==='crate'?'#c9904e':'#4aaf67';ctx.strokeStyle=o.k==='tree'?'#34834f':'#825d3e';ctx.lineWidth=4;if(o.k==='tree'){ctx.beginPath();ctx.arc(o.x+35,o.y+25,34,0,7);ctx.fill();ctx.fillStyle='#805735';ctx.fillRect(o.x+29,o.y+28,12,34)}else{ctx.fillRect(o.x,o.y,o.w,o.h);ctx.strokeRect(o.x,o.y,o.w,o.h)}}
function drawPlayer(p,s){ctx.save();ctx.globalAlpha=p.alive?1:.25;ctx.fillStyle='#192944';ctx.beginPath();ctx.ellipse(p.x,p.y+20,19,7,0,0,7);ctx.fill();ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,18,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x-6,p.y-3,3,0,7);ctx.arc(p.x+6,p.y-3,3,0,7);ctx.fill();ctx.fillStyle='#17253d';ctx.font='800 12px Nunito';ctx.textAlign='center';ctx.fillText(p.name,p.x,p.y-27);if(p.hasBomb){const pulse=5+Math.sin(Date.now()/90)*2;ctx.font='24px serif';ctx.fillText('💣',p.x,p.y-39);ctx.strokeStyle='#ff4e4e';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,pulse+22,0,7);ctx.stroke()}ctx.restore()}
function drawBoom(e){ctx.save();ctx.globalAlpha=e.life;ctx.fillStyle='#ffb52e';ctx.beginPath();ctx.arc(e.x,e.y,(1-e.life)*140+25,0,7);ctx.fill();ctx.fillStyle='#ef4b42';ctx.beginPath();ctx.arc(e.x,e.y,(1-e.life)*90+15,0,7);ctx.fill();ctx.restore()}
function drawPass(e,s){const a=s.players.find(p=>p.id===e.from),b=s.players.find(p=>p.id===e.to);if(!a||!b)return;ctx.save();ctx.globalAlpha=e.life;ctx.strokeStyle='#fff';ctx.setLineDash([8,8]);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore()}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1800)}
function showWinner(s){const w=s.players.find(p=>p.id===s.winnerId);$('modalIcon').textContent='🏆';$('modalTitle').textContent='WINNER!';$('modalText').textContent=`${w?.name||'The last survivor'} wins the relay!`;$('playAgain').classList.toggle('hidden',s.hostId!==socket.id);$('overlay').classList.remove('hidden')}
function escapeHtml(v){return v.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
