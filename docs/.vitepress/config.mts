import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "chibinuxt",
  description: "A VitePress Site",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Play", link: "/part-1/min-ssr" },
    ],

    logo: "/image.png",

    sidebar: [
      {
        text: "Part 1",
        items: [
          { text: "min SSR", link: "/part-1/min-ssr" },
          { text: "min Component", link: "/part-1/min-component" },
        ],
      },
    ],

    footer: {
      copyright: `Copyright © 2024-${new Date().getFullYear()} shoma`,
      message: "Released under the MIT License.",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/shoma-mano/chibinuxt" },
    ],
  },
});
