---
title: ox-content native plugin example
---

# Native Plugins

This example demonstrates **ox-content native plugins**.

## How It Works

Native plugins are simple functions that transform HTML after rendering.

```typescript
const myPlugin: OxContentPlugin = (html) => {
  return `<div class="wrapper">${html}</div>`;
};
```

## Benefits

- Simple API
- Full control over HTML output
- No external dependencies
- Can be async
