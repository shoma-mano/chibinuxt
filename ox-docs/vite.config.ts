import { defineConfig } from 'vite';
import { oxContent } from 'vite-plugin-ox-content';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const base = isProd ? '/chibinuxt/' : '/';

  return {
    base,

    plugins: [
      oxContent({
        srcDir: 'src/content',
        outDir: 'dist',
        base,

        ssg: {
          siteName: 'chibinuxt',
          ogImage: 'https://shoma-mano.github.io/chibinuxt/og-image.png',
        },

        highlight: true,
        highlightTheme: 'vitesse-dark',

        gfm: true,
        tables: true,
        taskLists: true,
        strikethrough: true,

        toc: true,
        tocMaxDepth: 3,
      }),
    ],

    build: {
      outDir: 'dist',
    },
  };
});
