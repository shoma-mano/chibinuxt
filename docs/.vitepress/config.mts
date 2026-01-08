import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'chibinuxt',
  description: 'Build Your Own Nuxt - A Retro Adventure',
  srcDir: 'src',
  markdown: {
    // Show h2 and h3 in the right sidebar (Table of Contents)
    toc: { level: [2, 3] },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/image.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap', rel: 'stylesheet' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: [2, 3],
    },
    nav: [
      { text: 'Guide', link: '/010-min-ssr' },
    ],

    logo: '/image.png',

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: '01 MIN SSR', link: '/010-min-ssr' },
          { text: '02 SERVER SFC', link: '/020-server-sfc' },
          { text: '03 CLIENT SFC', link: '/030-client-sfc' },
          { text: '04 ROUTER', link: '/040-router' },
          { text: '05 SPLIT PKG', link: '/050-split-into-packages' },
          { text: '06 ROOT COMPONENT', link: '/060-root-component' },
          { text: '07 PAGES', link: '/070-pages' },
          { text: '08 BUILD', link: '/080-build' },
        ],
      },
    ],

    footer: {
      copyright: `© 2024-${new Date().getFullYear()} SHOMA`,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shoma-mano/chibinuxt' },
    ],
  },
})
