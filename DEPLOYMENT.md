# Deployment Guide - Client-Side Only

Since this is a **100% client-side application**, deployment is simple and free!

## ☁️ Recommended: Vercel (Free)

### Method 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? (enter name)
# - Directory? ./
# - Override settings? No
```

### Method 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Set **Root Directory** to `client`
5. **Framework Preset**: Vite
6. Add Environment Variable: `VITE_GEMINI_API_KEY`
7. Click "Deploy"

### Vercel Configuration

The `client/vercel.json` is already configured:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

---

## 🚀 Alternative: Netlify (Free)

### Method 1: Netlify CLI

```bash
npm install -g netlify-cli
cd client
netlify deploy --prod
```

### Method 2: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Add environment variable: `VITE_GEMINI_API_KEY`
6. Deploy

---

## 📄 GitHub Pages (Free)

```bash
cd client

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Update vite.config.ts - add base
base: '/your-repo-name/'

# Deploy
npm run deploy
```

---

## ☁️ Cloudflare Pages (Free)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub repository
3. Configure:
   - **Build command**: `cd client && npm run build`
   - **Build output**: `client/dist`
4. Add environment variable: `VITE_GEMINI_API_KEY`
5. Save and deploy

---

## 🪣 AWS S3 + CloudFront (Advanced)

```bash
cd client
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 🐳 Docker (Self-Hosted)

```dockerfile
# Dockerfile in client folder
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t qr-pdf-tools .
docker run -p 80:80 qr-pdf-tools
```

---

## ⚙️ Environment Variables

For all deployment platforms, set:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Security Note**: The API key will be visible in the client bundle. For production, consider:
- Using Gemini's API key restrictions (restrict by domain)
- Implementing rate limiting on client side
- Or use a lightweight serverless function proxy for AI calls

---

## 🎯 Post-Deployment Checklist

- [ ] Test all QR generation modes
- [ ] Test PDF conversion features
- [ ] Verify AI features work (Gemini API)
- [ ] Check QR scanner (needs HTTPS for camera)
- [ ] Test on mobile devices
- [ ] Verify analytics tracking
- [ ] Check localStorage functionality
- [ ] Test offline functionality (PWA cache)

---

## 🔍 Troubleshooting

### Camera Not Working (QR Scanner)
- Requires HTTPS (localhost or deployed site)
- Check browser permissions

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working
- Prefix must be `VITE_` for Vite
- Rebuild after changing .env
- Some platforms need manual restart

### Large Bundle Size Warning
- Normal for this app (includes PDF libraries)
- Use build.rollupOptions.output.manualChunks for code splitting

---

## 📊 Performance Tips

1. **Enable Compression**: Most platforms auto-compress (gzip/brotli)
2. **CDN Caching**: Vercel/Netlify/Cloudflare provide this automatically
3. **Lazy Loading**: Already implemented for heavy components
4. **Image Optimization**: Use WebP format where possible

---

## 💰 Cost Comparison

| Platform | Free Tier | Bandwidth | Build Minutes |
|----------|-----------|-----------|---------------|
| **Vercel** | ✅ Unlimited sites | 100GB/mo | 6000 min/mo |
| **Netlify** | ✅ 1 site | 100GB/mo | 300 min/mo |
| **Cloudflare** | ✅ Unlimited | Unlimited | 500 builds/mo |
| **GitHub Pages** | ✅ 1 site/repo | 100GB/mo | N/A (static) |

**Recommendation**: Vercel for best DX, Cloudflare for unlimited bandwidth.

---

## 🚀 Custom Domain

### Vercel
```bash
vercel domains add yourdomain.com
```

### Netlify
Dashboard → Domain Settings → Add custom domain

### Cloudflare Pages
Automatically uses Cloudflare DNS

---

**That's it! Your client-side app is now live with zero server costs! 🎉**
