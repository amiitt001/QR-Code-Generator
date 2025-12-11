# QR Code Generator & PDF Converter

A powerful **100% client-side** web application for QR code generation and PDF conversion. All processing happens in your browser - no server required!

## 🎯 Why Client-Side?

✅ **Zero server dependencies** - All processing in browser  
✅ **Privacy-first** - Your data never leaves your device  
✅ **Fast & efficient** - No network latency  
✅ **Works offline** - Once loaded, no internet needed  
✅ **Free hosting** - Deploy to Vercel, Netlify, etc.

## 🚀 Quick Start

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Set up environment:**
   ```bash
   # Create .env file in client folder
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📦 Features

### QR Code Features
- ✨ AI-powered QR generation
- 🎨 Advanced customization (colors, shapes, sizes)
- 📊 Multiple formats (PNG, SVG, JPG)
- 📱 QR scanner with webcam
- 📚 History & batch generation
- 📈 Analytics dashboard

### PDF Features
- 📄 PDF to Images
- 🖼️ Images to PDF
- 📝 PDF Merge & Split
- 🗜️ PDF Compression
- 🔄 PDF Rotation

## 🛠️ Tech Stack

**Client-Side Libraries:**
- React 19 + TypeScript + Vite
- `qrcode` - QR generation
- `jspdf` + `pdf-lib` - PDF operations
- `html5-qrcode` - QR scanning
- Tailwind CSS 3

## 🚀 Deploy

**Vercel (Recommended):**
```bash
cd client
vercel
```

**Other options:** Netlify, GitHub Pages, Cloudflare Pages, AWS S3

## 📁 Structure

```
client/
├── src/
│   ├── components/     # React components
│   ├── services/       # Business logic (all client-side)
│   ├── pages/          # Page components
│   └── App.tsx         # Main app
├── vite.config.ts
└── package.json
```

## 🔐 Privacy & Security

- All processing in your browser
- No data sent to servers (except AI API)
- localStorage for history (stays on device)
- Open source - verify yourself

## 📞 Support

- Issues: [GitHub Issues](https://github.com/amiitt001/QR-Code-Generator/issues)
- Original AI Studio: https://ai.studio/apps/drive/1aBqBfkGzqS5Cg5ldLXOu-D89I24cvWuK

---


**Made with ❤️ - 100% Client-Side Application**