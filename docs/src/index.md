---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "chibinuxt"
  text: "Build Your Own Nuxt"
  tagline: "Build Your Own Nuxt Step by Step. \nA Comprehensive Guide to Mastering Nuxt.js."
  actions:
    - theme: brand
      text: Continue..?
      link: /10-minimum-example/010-min-ssr
    - theme: alt
      text: Nuxt Official
      link: https://nuxt.com
  image:
    src: /image.png

features:
  - title: Nitro
    icon:
      src: /satake-ken.png
    details: Learn How Nitro is integrated with Nuxt.
  - title: Vite
    icon:
      src: /satake-risu.png
    details: Learn How Vite is integrated with Nuxt.
  - title: Modules
    icon:
      src: /satake-nezumi.png
    details: Learn How Nuxt Modules worls.
---

<style>
:root {
  --vp-home-hero-name-color: transparent !important;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #34fe4f 20%, #41ffb1 40%, #34fe4f 60%, #41ffb1 80%) !important;  
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #34fe4f 70%, #41ffb1 30%) !important;
  --vp-home-hero-image-filter: blur(44px) !important;
  }

.image-bg {
  width: 280px !important;
  height: 280px !important;
}

.VPButton.brand {
  background-color: #444d82 !important;
}

.VPImage {
  max-height: 220px !important;
}

#VPContent {
  margin-top: 15px;
  margin-bottom: 20px;
}

.VPHero{
  margin-bottom: 15px;
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
</style>
