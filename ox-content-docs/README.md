# ox-content-docs

This directory contains [ox-content](https://github.com/ubugeeei/ox-content) as a git subtree for testing purposes in chibinuxt.

## Purpose

- Test ox-content's Vite plugin with chibinuxt documentation
- Dogfood ox-content for building the chibinuxt docs site

## Usage

### Update from upstream

```bash
pnpm pull:ox-content
```

### Build and run docs

```bash
cd ox-content-docs

# Install dependencies
pnpm install

# Build NAPI bindings (requires Rust)
cd crates/ox_content_napi && pnpm build && cd ../..

# Build Vite plugin
cd npm/vite-plugin-ox-content && pnpm build && cd ../..

# Run docs dev server
cd docs && pnpm dev
```

## Upstream

- Repository: https://github.com/ubugeeei/ox-content
- Documentation: https://ubugeeei.github.io/ox-content/

## License

MIT License
