# FastBaidu Frontend

SvelteKit frontend for FastBaidu - deployed on Cloudflare Pages with SSR support.

## 🚀 Tech Stack

- **Framework**: SvelteKit 2.0
- **Adapter**: @sveltejs/adapter-cloudflare (Cloudflare Workers)
- **Deployment**: Cloudflare Pages (SSR)
- **API**: https://api.fastbaidu.app

## 📦 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
VITE_API_URL=https://api.fastbaidu.app npm run build
```

## 🌐 Deployment (Cloudflare Pages)

### Automatic Deployment via Git

1. **Connect this repo to Cloudflare Pages**
2. **Build settings**:
   - Build command: `npm run build`
   - Build output directory: `.svelte-kit/cloudflare`
   - Root directory: `/`

3. **Environment variables**:
   ```
   VITE_API_URL=https://api.fastbaidu.app
   ```

4. **Functions**: Enabled (required for SSR)

### Manual Build & Deploy

```bash
# Build locally
VITE_API_URL=https://api.fastbaidu.app npm run build

# Output will be in .svelte-kit/cloudflare/
# Upload this directory to Cloudflare Pages
```

## 🔗 Related

- Backend repo: [fastbaidu](https://github.com/Tambam2001/fastbaidu)
- Documentation: See backend repo for full deployment guide

## 📄 License

MIT
