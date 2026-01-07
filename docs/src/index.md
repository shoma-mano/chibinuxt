---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "chibinuxt"
  text: "Build Your Own Nuxt"
  tagline: "A step-by-step guide to understanding Nuxt internals"
  actions:
    - theme: brand
      text: START
      link: /part-1/010-min-ssr
    - theme: alt
      text: GitHub
      link: https://github.com/shoma-mano/chibinuxt
  image:
    src: /image.png

features:
  - title: NITRO
    icon:
      src: /satake-ken.png
    details: Learn how Nitro server engine integrates with Nuxt for universal rendering.
  - title: VITE
    icon:
      src: /satake-risu.png
    details: Understand Vite bundler integration and hot module replacement.
  - title: MODULES
    icon:
      src: /satake-nezumi.png
    details: Explore the Nuxt module system and extensibility patterns.
---

<div class="home-content">
  <div class="stats-bar">
    <div class="stat">
      <span class="stat-label">CHAPTERS</span>
      <span class="stat-value">5</span>
    </div>
    <div class="stat">
      <span class="stat-label">TOPICS</span>
      <span class="stat-value">SSR / SFC / ROUTING</span>
    </div>
    <div class="stat">
      <span class="stat-label">STATUS</span>
      <span class="stat-value blink">READY</span>
    </div>
  </div>
</div>

<style>
:root {
  --vp-home-hero-name-color: transparent !important;
  --vp-home-hero-name-background: linear-gradient(135deg, #4ade80 0%, #22d3ee 100%) !important;
  --vp-home-hero-image-background-image: linear-gradient(135deg, #4ade80 50%, #22d3ee 50%) !important;
  --vp-home-hero-image-filter: blur(44px) !important;
}

.image-bg {
  width: 280px !important;
  height: 280px !important;
}

.VPImage {
  max-height: 200px !important;
}

.home-content {
  max-width: 900px;
  margin: 48px auto;
  padding: 0 24px;
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding: 20px 32px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.55rem;
  color: #94a3b8;
  letter-spacing: 1px;
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4ade80;
}

.blink {
  animation: blink-anim 1.5s infinite;
}

@keyframes blink-anim {
  0%, 70% { opacity: 1; }
  71%, 100% { opacity: 0.3; }
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px) !important;
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px) !important;
  }
}

@media (max-width: 640px) {
  .stats-bar {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .stat-value {
    font-size: 0.85rem;
  }
}
</style>
