// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import typegen from 'eslint-typegen'

export default createConfigForNuxt({
  features: {
    stylistic: {
      commaDangle: 'always-multiline',
    },
    tooling: true,
  },
})
  .append({
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  })
  // Generate type definitions for the eslint config
  .onResolved((configs) => {
    return typegen(configs)
  })
