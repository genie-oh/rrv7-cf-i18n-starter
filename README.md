## React Router v7 + Cloudflare Workers i18n Starter

> Built for learning and rapid prototyping of i18n-enabled SSR on the edge.

This is a multilingual-ready starter template using:

- **React Router v7 (Remix Router)**: for client/server shared routing
- **remix-i18next**: to handle internationalization with SSR support
- **Cloudflare Workers**: for edge runtime deployment
- **i18next**: flexible translation framework
- **Chakra UI**: simple and themeable component system
- **Storybook**: component-level i18n testing
- **Cache API (Cloudflare Workers)**: to enable SSR page-level caching

### Key Features

- 📁 **URL-path-based language routing** (`/en/sample`, `/ja/sample`, `/ko/sample`)
- 🌐 **Automatic locale detection** using `accept-language` header
- ⚡️ **Edge rendering with caching** via Cloudflare Workers Cache API
- 🧪 **Storybook support** for locale-specific component previews
- 🧩 Extensible and lightweight structure for small-to-mid size i18n projects

### Quick Start

```bash
pnpm install
pnpm dev
```

### Deployment

```bash
pnpm run deploy
```
