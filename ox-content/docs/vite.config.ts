import { defineConfig } from 'vite';
import { oxContent } from 'vite-plugin-ox-content';

/**
 * chibinuxt Documentation Site
 *
 * Build Your Own Nuxt - documentation using ox-content
 */
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

        mermaid: false,
      }),
    ],

    build: {
      outDir: 'dist',
    },
  };
});
