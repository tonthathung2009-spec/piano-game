# BOM RELAY

A complete multiplayer hot-potato game built with HTML Canvas, CSS, Node.js and Socket.IO.

## Run

```bash
npm install
npm start
```

Open http://localhost:3000 in multiple browser tabs or share the host's LAN address. No database or login is required.

## Rules

- Create a room and share its six-character code.
- 4–20 players can join. Everyone readies up; the host starts the game.
- The server randomly gives one living player a bomb with a 10-second timer.
- Move with WASD. Stand near another player and press E to pass the bomb; the timer never resets.
- When the timer reaches zero, the holder is eliminated. The bomb is assigned to another survivor.
- The last survivor wins. The host can start another game from the winner screen.

The server owns movement, collision, timer, passing, elimination, disconnect handling and winner state. The client only renders the authoritative state.
