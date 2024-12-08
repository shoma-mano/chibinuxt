import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "chibinuxt",
  description: "A VitePress Site",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Play", link: "/markdown-examples" },
    ],

    logo: "/image.png",

    sidebar: [
      {
        text: "Part 1",
        items: [
          { text: "Chapter 1", link: "/part-1/markdown-examples" },
          { text: "Chapter 2", link: "/part-1/api-examples" },
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
