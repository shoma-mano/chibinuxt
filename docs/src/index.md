---
layout: home

hero:
  name: "CHIBINUXT"
  text: "BUILD YOUR OWN NUXT"
  tagline: ">> PRESS START TO BEGIN <<"
  actions:
    - theme: brand
      text: "[ START GAME ]"
      link: /part-1/010-min-ssr
    - theme: alt
      text: "[ GITHUB ]"
      link: https://github.com/shoma-mano/chibinuxt
  image:
    src: /image.png

features:
  - title: "STAGE 1: NITRO"
    icon:
      src: /satake-ken.png
    details: "Server engine secrets. Master the Nitro integration."
  - title: "STAGE 2: VITE"
    icon:
      src: /satake-risu.png
    details: "Bundler mastery. Hot module replacement unlocked."
  - title: "STAGE 3: MODULES"
    icon:
      src: /satake-nezumi.png
    details: "Extensibility powers. Module system revealed."
---

<div class="retro-home">
  <div class="scanlines"></div>
  <div class="arcade-frame">
    <div class="screen-border">
      <div class="game-screen">
        <div class="title-banner">
          <span class="pixel-text glitch">NUXT QUEST</span>
        </div>
        <div class="game-panel">
          <div class="panel-row">
            <span class="label">PLAYER</span>
            <span class="value">YOU</span>
          </div>
          <div class="panel-row">
            <span class="label">MISSION</span>
            <span class="value">BUILD NUXT</span>
          </div>
          <div class="panel-row">
            <span class="label">DIFFICULTY</span>
            <div class="difficulty-bar">
              <span class="filled"></span>
              <span class="filled"></span>
              <span class="filled"></span>
              <span class="empty"></span>
              <span class="empty"></span>
            </div>
          </div>
        </div>
        <div class="high-scores">
          <div class="score-title">- HIGH SCORES -</div>
          <div class="score-entry">
            <span class="rank">1ST</span>
            <span class="name">SSR....</span>
            <span class="pts">1000</span>
          </div>
          <div class="score-entry">
            <span class="rank">2ND</span>
            <span class="name">SFC....</span>
            <span class="pts">0800</span>
          </div>
          <div class="score-entry">
            <span class="rank">3RD</span>
            <span class="name">ROUTER.</span>
            <span class="pts">0600</span>
          </div>
        </div>
        <div class="insert-coin">
          <span class="blink">INSERT COIN</span>
        </div>
        <div class="credits">
          <span>CREDIT 01</span>
        </div>
      </div>
    </div>
  </div>
  <div class="control-panel">
    <div class="joystick"></div>
    <div class="buttons">
      <div class="btn btn-a">A</div>
      <div class="btn btn-b">B</div>
    </div>
  </div>
</div>

<style>
/* Retro colors */
:root {
  --arcade-green: #00ff41;
  --arcade-cyan: #00ffff;
  --arcade-yellow: #ffff00;
  --arcade-pink: #ff6ec7;
  --arcade-orange: #ff8c00;
  --arcade-dark: #0a0a0a;
  --arcade-darker: #050505;
}

/* Hero section overrides */
:root {
  --vp-home-hero-name-color: transparent !important;
  --vp-home-hero-name-background: linear-gradient(90deg, #00ff41 0%, #00ffff 50%, #00ff41 100%) !important;
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #00ff41 50%, #00ffff 50%) !important;
  --vp-home-hero-image-filter: blur(40px) !important;
}

.VPHero .name {
  font-family: 'Press Start 2P', monospace !important;
  font-size: 1.5rem !important;
  animation: text-flicker 4s infinite;
}

.VPHero .text {
  font-family: 'Press Start 2P', monospace !important;
  font-size: 0.8rem !important;
  color: var(--arcade-cyan) !important;
  letter-spacing: 2px;
}

.VPHero .tagline {
  font-family: 'Press Start 2P', monospace !important;
  font-size: 0.6rem !important;
  color: var(--arcade-yellow) !important;
  animation: blink-fast 1s infinite;
}

.VPButton.brand {
  font-family: 'Press Start 2P', monospace !important;
  font-size: 0.5rem !important;
  background: var(--arcade-green) !important;
  border: 3px solid #00cc33 !important;
  color: #000 !important;
  box-shadow: 4px 4px 0 #005500, inset 0 0 10px rgba(255,255,255,0.3);
  border-radius: 0 !important;
}

.VPButton.brand:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #005500;
}

.VPButton.alt {
  font-family: 'Press Start 2P', monospace !important;
  font-size: 0.5rem !important;
  border: 3px solid var(--arcade-cyan) !important;
  color: var(--arcade-cyan) !important;
  border-radius: 0 !important;
}

/* Feature cards - arcade style */
.VPFeature {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%) !important;
  border: 3px solid var(--arcade-green) !important;
  border-radius: 0 !important;
  position: relative;
}

.VPFeature::before {
  content: '>';
  position: absolute;
  top: 16px;
  left: 16px;
  color: var(--arcade-green);
  font-family: 'Press Start 2P', monospace;
  font-size: 0.6rem;
  animation: blink-fast 0.8s infinite;
}

.VPFeature:hover {
  border-color: var(--arcade-cyan) !important;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.5), inset 0 0 30px rgba(0, 255, 65, 0.1);
}

.VPFeature .title {
  font-family: 'Press Start 2P', monospace !important;
  font-size: 0.55rem !important;
  color: var(--arcade-yellow) !important;
  padding-left: 24px;
}

.VPFeature .details {
  font-family: 'Press Start 2P', monospace !important;
  font-size: 0.45rem !important;
  color: #888 !important;
  line-height: 1.8 !important;
}

/* Main retro home container */
.retro-home {
  position: relative;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}

/* Scanlines effect */
.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  z-index: 1000;
}

/* Arcade cabinet frame */
.arcade-frame {
  background: linear-gradient(180deg, #2a2a4a 0%, #1a1a2e 100%);
  border: 4px solid #444;
  border-radius: 8px;
  padding: 12px;
  box-shadow:
    0 0 30px rgba(0, 255, 65, 0.2),
    inset 0 2px 0 rgba(255,255,255,0.1);
}

.screen-border {
  background: #000;
  border: 3px solid #222;
  border-radius: 4px;
  padding: 4px;
}

.game-screen {
  background: linear-gradient(180deg, #0a0a1a 0%, #050510 100%);
  border: 2px solid var(--arcade-green);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.game-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%);
  pointer-events: none;
}

/* Title banner */
.title-banner {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  border: 2px solid var(--arcade-yellow);
  background: rgba(255, 255, 0, 0.05);
}

.pixel-text {
  font-family: 'Press Start 2P', monospace;
  font-size: 1rem;
  color: var(--arcade-yellow);
  text-shadow:
    2px 2px 0 var(--arcade-orange),
    4px 4px 0 rgba(0,0,0,0.5);
}

.glitch {
  animation: glitch 3s infinite;
}

/* Game info panel */
.game-panel {
  background: rgba(0, 255, 65, 0.05);
  border: 1px solid var(--arcade-green);
  padding: 12px;
  margin-bottom: 16px;
}

.panel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.5rem;
}

.panel-row:last-child {
  margin-bottom: 0;
}

.panel-row .label {
  color: var(--arcade-cyan);
}

.panel-row .value {
  color: var(--arcade-green);
}

.difficulty-bar {
  display: flex;
  gap: 4px;
}

.difficulty-bar span {
  width: 12px;
  height: 8px;
  border: 1px solid var(--arcade-green);
}

.difficulty-bar .filled {
  background: var(--arcade-green);
  box-shadow: 0 0 5px var(--arcade-green);
}

/* High scores section */
.high-scores {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px dashed var(--arcade-pink);
}

.score-title {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.5rem;
  color: var(--arcade-pink);
  text-align: center;
  margin-bottom: 10px;
}

.score-entry {
  display: flex;
  justify-content: space-between;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.45rem;
  color: var(--arcade-green);
  margin-bottom: 4px;
}

.score-entry .rank {
  color: var(--arcade-yellow);
  width: 30px;
}

.score-entry .name {
  flex: 1;
  text-align: left;
  margin-left: 8px;
}

.score-entry .pts {
  color: var(--arcade-cyan);
}

/* Insert coin */
.insert-coin {
  text-align: center;
  padding: 12px;
  margin-bottom: 8px;
}

.insert-coin span {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.6rem;
  color: var(--arcade-yellow);
}

/* Credits */
.credits {
  text-align: center;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.4rem;
  color: #666;
}

/* Control panel decoration */
.control-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(180deg, #333 0%, #222 100%);
  border-radius: 0 0 20px 20px;
  border: 3px solid #444;
  border-top: none;
}

.joystick {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #555, #222);
  border-radius: 50%;
  border: 3px solid #111;
  box-shadow: 0 4px 0 #111;
}

.buttons {
  display: flex;
  gap: 12px;
}

.btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.4rem;
  color: #000;
  box-shadow: 0 4px 0 rgba(0,0,0,0.5);
}

.btn-a {
  background: radial-gradient(circle at 30% 30%, #ff6666, #cc0000);
  border: 2px solid #990000;
}

.btn-b {
  background: radial-gradient(circle at 30% 30%, #6666ff, #0000cc);
  border: 2px solid #000099;
}

/* Animations */
@keyframes blink-fast {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@keyframes text-flicker {
  0%, 90%, 100% { opacity: 1; }
  91% { opacity: 0.8; }
  92% { opacity: 1; }
  93% { opacity: 0.9; }
  94% { opacity: 1; }
}

@keyframes glitch {
  0%, 90%, 100% {
    text-shadow:
      2px 2px 0 var(--arcade-orange),
      4px 4px 0 rgba(0,0,0,0.5);
  }
  91% {
    text-shadow:
      -2px 2px 0 var(--arcade-cyan),
      4px 4px 0 rgba(0,0,0,0.5);
  }
  93% {
    text-shadow:
      2px -2px 0 var(--arcade-pink),
      4px 4px 0 rgba(0,0,0,0.5);
  }
}

.blink {
  animation: blink-fast 1s infinite;
}

/* Responsive */
@media (max-width: 640px) {
  .VPHero .name {
    font-size: 1rem !important;
  }

  .VPHero .text {
    font-size: 0.6rem !important;
  }

  .pixel-text {
    font-size: 0.7rem;
  }

  .arcade-frame {
    padding: 8px;
  }

  .game-screen {
    padding: 12px;
  }

  .control-panel {
    display: none;
  }
}

/* Dark mode enhancements */
.dark .arcade-frame {
  box-shadow:
    0 0 50px rgba(0, 255, 65, 0.3),
    inset 0 2px 0 rgba(255,255,255,0.05);
}

.dark .game-screen {
  box-shadow: inset 0 0 50px rgba(0, 255, 65, 0.1);
}
</style>
