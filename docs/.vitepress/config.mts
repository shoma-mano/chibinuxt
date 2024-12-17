import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "chibinuxt",
  description: "A VitePress Site",
  srcDir: "src",
  head: [["link", { rel: "icon", type: "image/png", href: "/image.png" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Play", link: "/10-minimum-example/010-min-ssr" },
    ],

    logo: "/image.png",

    sidebar: [
      {
        text: "Part I",
        base: "/10-minimum-example/",
        items: [
          { text: "010-min-ssr", link: "010-min-ssr" },
          {
            text: "020-server-sfc",
            link: "020-server-sfc",
          },
          {
            text: "030-client-sfc",
            link: "030-client-sfc",
          },
          {
            text: "040-router",
            link: "040-router",
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
