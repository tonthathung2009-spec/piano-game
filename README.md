# piano-game
:root {
  --bg-1: #140c3a;
  --bg-2: #2a1268;
  --bg-3: #431a8a;
  --accent: #ffd166;
  --accent-2: #7bdff2;
  --pink: #ff7eb6;
  --ink: #f7f3ff;
  --muted: #d5c8f5;
  --shadow: 0 18px 40px rgba(8, 4, 28, 0.35);
  --radius: 22px;
  --font: "Segoe UI", "Trebuchet MS", "Nunito", sans-serif;
}

* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  font-family: var(--font);
  color: var(--ink);
  background:
    radial-gradient(1200px 600px at 10% -10%, #6a3cff55, transparent 50%),
    radial-gradient(900px 500px at 110% 10%, #ff7eb655, transparent 46%),
    linear-gradient(160deg, var(--bg-1), var(--bg-2) 45%, #1c0d4a);
  overflow-x: hidden;
}

#app {
  position: relative;
  min-height: 100dvh;
  padding: 16px;
}

.bg-notes {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.float-note {
  position: absolute;
  bottom: -40px;
  color: rgba(255, 255, 255, 0.14);
  animation: rise linear infinite;
}
@keyframes rise {
  from { transform: translateY(0) rotate(0deg); opacity: 0; }
  12% { opacity: 0.7; }
  to { transform: translateY(-110vh) rotate(24deg); opacity: 0; }
}

main { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto; }
.screen { animation: fadeIn 0.35s ease; }
.screen[hidden] { display: none !important; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

.home-hero {
  min-height: calc(100dvh - 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 12px 48px;
}
.brand-kicker {
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-2);
  font-size: 0.82rem;
  margin-bottom: 8px;
}
.title {
  font-size: clamp(2.6rem, 8vw, 5.2rem);
  margin: 0;
  line-height: 1;
  text-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}
.subtitle {
  margin: 14px 0 36px;
  font-size: clamp(1.15rem, 3vw, 1.6rem);
  color: var(--muted);
  font-style: italic;
}
.home-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(420px, 100%);
}

.btn {
  border: 0;
  border-radius: 16px;
  padding: 14px 22px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  color: #1a1033;
  box-shadow: var(--shadow);
  transition: transform 0.16s ease, filter 0.16s ease, box-shadow 0.16s ease;
}
.btn:hover { transform: translateY(-2px) scale(1.02); filter: brightness(1.05); }
.btn:active { transform: translateY(1px) scale(0.98); }
.btn:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.btn-xl { padding: 18px 24px; font-size: 1.25rem; }
.btn-primary { background: linear-gradient(180deg, #ffe08a, #ffb703); }
.btn-secondary { background: linear-gradient(180deg, #9bf6ff, #48cae4); }
.btn-soft { background: linear-gradient(180deg, #f3e8ff, #d0bfff); }
.btn-ghost {
  background: rgba(255,255,255,0.12);
  color: white;
  box-shadow: none;
  backdrop-filter: blur(8px);
}

.topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.screen-heading { margin: 0; font-size: clamp(1.1rem, 3vw, 1.6rem); text-align: center; flex: 1 1 140px; }
.topbar-spacer { min-width: 72px; }

.volume {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.1);
  padding: 8px 10px;
  border-radius: 999px;
}
.volume label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}
.mute-btn {
  background: transparent;
  border: 0;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 8px;
}
.mute-btn:focus-visible { outline: 3px solid var(--accent); }
.volume-slider { width: 92px; accent-color: var(--accent); }

.play-hint, .play-subhint { text-align: center; margin: 4px 0; }
.play-hint { font-size: 1.25rem; font-weight: 800; }
.play-subhint, .current-note, .keymap-legend { color: var(--muted); }
.keymap-legend {
  text-align: center;
  font-size: 0.82rem;
  margin: 0 0 24px;
}
.current-note {
  text-align: center;
  font-weight: 700;
  color: var(--accent);
  min-height: 1.4em;
}

.piano-host {
  margin: 16px auto 28px;
  width: 100%;
  max-width: 1080px;
  touch-action: none;
}
.piano {
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  filter: drop-shadow(0 18px 24px rgba(0,0,0,0.35));
}
.piano-blacks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.piano-blacks .key { pointer-events: auto; }
.piano-whites {
  display: flex;
  height: clamp(170px, 28vw, 250px);
  background: #111;
  border-radius: 0 0 14px 14px;
  overflow: hidden;
  border: 6px solid #1a1230;
}
.key {
  position: relative;
  border: 0;
  cursor: pointer;
  font: inherit;
  transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.08s ease, background 0.08s ease;
}
.key:focus-visible { outline: 3px solid #7bdff2; outline-offset: -4px; z-index: 4; }
.key.white {
  flex: 1;
  background: linear-gradient(180deg, #fff, #e9e4f7);
  border-right: 1px solid #c9c0e0;
  border-radius: 0 0 10px 10px;
  color: #2b2150;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 10px;
  min-width: 0;
  box-shadow: inset 0 -8px 0 rgba(90, 70, 140, 0.12);
}
.key.white:last-child { border-right: 0; }
.key.black {
  position: absolute;
  top: 0;
  height: 58%;
  background: linear-gradient(180deg, #3b3358, #120c22);
  color: #f4edff;
  z-index: 3;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 8px 10px rgba(0,0,0,0.35), inset 0 -6px 0 #000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 8px;
}
.key-note { font-size: 0.72rem; font-weight: 800; }
.key-kbd { font-size: 0.62rem; opacity: 0.72; }
.key-marker {
  position: absolute;
  top: 8px;
  opacity: 0;
  transform: translateY(-6px);
  font-size: 0.9rem;
  pointer-events: none;
}
.key.active.white {
  transform: translateY(5px);
  background: linear-gradient(180deg, #d9f3ff, #b7e4ff);
  box-shadow: inset 0 -4px 0 rgba(40, 80, 140, 0.2), 0 0 18px #7bdff2;
}
.key.active.black {
  transform: translateY(4px);
  filter: brightness(1.45);
  box-shadow: 0 0 18px #c77dff;
}
.key.hint {
  box-shadow: 0 0 0 3px #ffd166, 0 0 24px #ffd166;
  animation: pulse 1.1s ease-in-out infinite;
  z-index: 5;
}
.key.hint .key-marker { opacity: 1; animation: bob 0.9s ease-in-out infinite; }
.key.white.hint { background: linear-gradient(180deg, #fff7cc, #ffd166); }
.key.black.hint { background: linear-gradient(180deg, #6b4b00, #2b1a00); color: #ffe9a6; }
.key.wrong { animation: shake 0.35s ease; background: #ffb3c1 !important; }
@keyframes pulse {
  50% { box-shadow: 0 0 0 5px #fff3, 0 0 32px #ffd166; }
}
@keyframes bob {
  50% { transform: translateY(2px); }
}
@keyframes shake {
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.song-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 12px 0 40px;
}
.song-card {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  transition: transform 0.16s ease;
}
.song-card:hover { transform: translateY(-4px); }
.song-card.featured {
  background: linear-gradient(160deg, rgba(255,209,102,0.22), rgba(255,126,182,0.18));
  border-color: rgba(255,209,102,0.55);
  padding: 28px;
}
.song-emoji { font-size: 2rem; margin: 0 0 6px; }
.song-card h3 { margin: 0 0 4px; }
.difficulty {
  display: inline-block;
  margin: 0 0 8px;
  background: rgba(123, 223, 242, 0.2);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}
.song-desc { color: var(--muted); margin-top: 0; }

.learn-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}
.progress-block { flex: 1 1 240px; }
.progress-label { margin: 0 0 6px; font-weight: 800; }
.progress-track {
  height: 14px;
  background: rgba(255,255,255,0.14);
  border-radius: 999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #ffd166, #ff7eb6);
  border-radius: inherit;
  transition: width 0.28s ease;
}
.learn-actions { display: flex; gap: 8px; }
.next-note-panel {
  margin: 16px 0 8px;
  text-align: center;
  background: rgba(255,255,255,0.08);
  border-radius: 18px;
  padding: 12px;
}
.next-kicker { margin: 0; letter-spacing: 0.12em; text-transform: uppercase; font-size: 0.75rem; color: var(--accent-2); }
.next-note-name { margin: 4px 0 8px; font-size: 2rem; font-weight: 800; color: var(--accent); }
.upcoming { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; align-items: center; }
.chip {
  background: rgba(255,255,255,0.12);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
}
.chip.current { background: var(--accent); color: #2b1b00; font-weight: 800; }
.chip-arrow { opacity: 0.6; }
.feedback {
  text-align: center;
  min-height: 1.4em;
  color: #ffd6de;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.feedback.show { opacity: 1; }

.overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: rgba(12, 6, 32, 0.62);
  display: grid;
  place-items: center;
  padding: 20px;
}
.overlay[hidden] { display: none !important; }
.overlay-card {
  position: relative;
  z-index: 3;
  background: linear-gradient(180deg, #3b1d86, #241056);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 24px;
  padding: 28px 22px;
  text-align: center;
  max-width: 480px;
  width: min(480px, 100%);
  box-shadow: var(--shadow);
}
.overlay-celebrate { background: rgba(12, 6, 32, 0.45); }
#confetti-canvas, .clap-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.clap {
  position: absolute;
  animation: clapFloat ease-in-out infinite;
  transform: rotate(var(--rot));
}
@keyframes clapFloat {
  0%, 100% { transform: translateY(0) rotate(var(--rot)) scale(1); }
  50% { transform: translateY(-14px) rotate(calc(var(--rot) + 10deg)) scale(1.12); }
}
.complete-actions { display: flex; flex-direction: column; gap: 10px; }
.celebrate-card h2 { font-size: clamp(1.8rem, 5vw, 2.6rem); margin-top: 0; }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

@media (min-width: 760px) {
  .song-grid { grid-template-columns: 1.15fr 1fr; }
  .song-card.featured { grid-row: span 2; display: flex; flex-direction: column; justify-content: center; }
  .home-actions { width: min(520px, 100%); }
}

@media (max-width: 700px) {
  .volume-slot { flex: 1 1 100%; }
  .volume { justify-content: space-between; }
  .volume-slider { width: 140px; }
  .key-kbd { font-size: 0.5rem; }
  .key-note { font-size: 0.58rem; }
  .piano-whites { height: 176px; }
  .key.black .key-kbd { font-size: 0.42rem; }
}

@media (max-width: 420px) {
  .key-note { font-size: 0.5rem; }
  .btn-xl { font-size: 1.05rem; }
}
