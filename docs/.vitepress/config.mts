import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'chibinuxt',
  description: 'Build Your Own Nuxt - A Retro Adventure',
  srcDir: 'src',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/image.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap', rel: 'stylesheet' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'HOME', link: '/' },
      { text: 'PLAY', link: '/part-1/010-min-ssr' },
    ],

    logo: '/image.png',

    sidebar: [
      {
        text: 'PART 1',
        base: '/part-1/',
        items: [
          { text: '1-1 MIN SSR', link: '010-min-ssr' },
          { text: '1-2 SERVER SFC', link: '020-server-sfc' },
          { text: '1-3 CLIENT SFC', link: '030-client-sfc' },
          { text: '1-4 ROUTER', link: '040-router' },
        ],
      },
      {
        text: 'PART 2',
        base: '/part-2/',
        items: [
          { text: '2-1 SPLIT PKG', link: '050-split-into-packages' },
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
