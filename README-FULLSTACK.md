# QR Code Generator & PDF Converter - Full Stack

A comprehensive multi-functional tool for QR code generation and PDF conversion operations.

## 🎯 Features

### QR Code Features
- Generate custom QR codes
- Multiple export formats (PNG, SVG, JPG)
- Color customization
- Size and quality control
- Error correction levels
- Smart QR generation with AI
- QR code history
- Batch generation
- Analytics dashboard

### PDF Conversion Features
- **PDF to Images** - Convert PDF pages to PNG/JPG
- **Images to PDF** - Combine images into PDF
- **PDF to Word** - Extract content to Word format
- **Word to PDF** - Convert documents to PDF
- **PDF Merge** - Combine multiple PDFs
- **PDF Split** - Separate pages
- **PDF Compress** - Reduce file size
- **PDF Rotate** - Rotate pages

### Additional Features
- Analytics dashboard
- Usage statistics
- Batch processing
- File history
- Advanced customization
- Responsive design

## 📁 Project Structure

```
.
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API services
│   │   └── hooks/     # Custom hooks
│   └── package.json
│
├── server/             # Backend Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
└── package.json       # Root package manager
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd QR-Code-Generator
```

2. **Install all dependencies**
```bash
npm run install:all
```

Or install separately:
```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

3. **Configure environment variables**

**Server (.env):**
```env
PORT=5000
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Development

**Run both client and server:**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Server (http://localhost:5000)
npm run dev:server

# Terminal 2 - Client (http://localhost:3000)
npm run dev:client
```

### Production Build

```bash
npm run build
```

## 📡 API Documentation

See [Server README](./server/README.md) for detailed API documentation.

### Base URL
```
http://localhost:5000/api
```

### Main Endpoints

- `POST /api/pdf/to-images` - Convert PDF to images
- `POST /api/pdf/from-images` - Create PDF from images
- `POST /api/pdf/merge` - Merge multiple PDFs
- `POST /api/pdf/split` - Split PDF pages
- `POST /api/pdf/compress` - Compress PDF
- `POST /api/pdf/rotate` - Rotate PDF pages
- `POST /api/qr/generate` - Generate QR code

## 🛠️ Technology Stack

### Frontend (Client)
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **jsPDF** - Client-side PDF generation
- **pdf-lib** - PDF manipulation

### Backend (Server)
- **Express** - Web framework
- **TypeScript** - Type safety
- **pdf-lib** - PDF processing
- **sharp** - Image processing
- **multer** - File uploads
- **qrcode** - QR generation

## 📋 Migration Guide

If you're moving from a monolithic structure, see [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) for detailed steps.

## 🔒 Security

- CORS configuration
- Rate limiting (100 req/15min)
- File size limits
- Helmet security headers
- Input validation

## 📈 Performance

- Gzip compression
- Image optimization
- Lazy loading
- Code splitting
- CDN-ready builds

## 🚢 Deployment

### Client (Vercel)
```bash
cd client
vercel
```

### Server (Railway/Heroku)
```bash
cd server
# Follow platform-specific deployment guide
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review API documentation

## 🎯 Roadmap

- [ ] Real-time collaboration
- [ ] Cloud storage integration
- [ ] Advanced OCR for PDFs
- [ ] Mobile app versions
- [ ] API rate limiting tiers
- [ ] Webhook support
- [ ] Batch API endpoints

## 📚 Documentation

- [Server API Documentation](./server/README.md)
- [Migration Guide](./MIGRATION-GUIDE.md)
- [Dashboard Features](./DASHBOARD.md)

---

Made with ❤️ for the developer community
