import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "chibinuxt",
  description: "A VitePress Site",
  srcDir: "src",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Play", link: "/10-minimum-example/010-min-ssr" },
    ],

    logo: "/image.png",

    sidebar: [
      {
        text: "Part 1",
        base: "/10-minimum-example/",
        items: [
          { text: "010-min-ssr", link: "010-min-ssr" },
          {
            text: "020-min-server-sfc",
            link: "020-min-server-sfc",
          },
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
