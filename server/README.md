# Server - Optional (Not Currently Used)

⚠️ **IMPORTANT**: This server is **NOT REQUIRED**. The application runs 100% client-side in the browser.

## Current Status

**The main application does NOT use this server.** All operations run client-side:
- ✅ QR generation: Browser-based (`qrcode` library)
- ✅ PDF operations: Browser-based (`jspdf`, `pdf-lib`)
- ✅ No API calls needed (except Google Gemini for AI)
- ✅ **No hosting costs - fully static deployment**

## Why This Exists

This server is a **reference implementation** kept for future scalability if you need:

### When You'd Need a Server

1. **Heavy Processing** (>50MB files, 100+ batch operations, OCR)
2. **User Accounts** (database, cloud sync, sharing)
3. **Analytics** (track QR scans across users)
4. **Enterprise** (multi-user, access control, compliance)

---

## 🚀 Features (If You Enable Server)

### PDF Operations
- **PDF to Images** - Convert PDF pages to PNG/JPG images
- **Images to PDF** - Combine multiple images into a single PDF
- **Merge PDFs** - Combine multiple PDF files
- **Split PDF** - Separate PDF into individual pages
- **Compress PDF** - Reduce PDF file size
- **Rotate PDF** - Rotate PDF pages (90°, 180°, 270°)

### QR Code Operations
- **Generate QR** - Create QR codes with customization
- **Scan QR** - Decode QR codes from images (planned)

## 📦 Installation

```bash
cd server
npm install
```

## 🔧 Configuration

1. Copy `.env.example` to `.env`
2. Configure environment variables:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
```

## 🏃 Running

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📡 API Endpoints

### PDF Endpoints

#### Convert PDF to Images
```
POST /api/pdf/to-images
Content-Type: multipart/form-data

Body:
- pdf: File
- format: string (png|jpg|jpeg|webp)
- quality: number (1-100)
- scale: number
```

#### Convert Images to PDF
```
POST /api/pdf/from-images
Content-Type: multipart/form-data

Body:
- images: File[] (up to 20 images)
- pageSize: string (A4|Letter|Legal)
- orientation: string (portrait|landscape)
```

#### Merge PDFs
```
POST /api/pdf/merge
Content-Type: multipart/form-data

Body:
- pdfs: File[] (up to 10 PDFs)
```

#### Split PDF
```
POST /api/pdf/split
Content-Type: multipart/form-data

Body:
- pdf: File
```

#### Compress PDF
```
POST /api/pdf/compress
Content-Type: multipart/form-data

Body:
- pdf: File
```

#### Rotate PDF
```
POST /api/pdf/rotate
Content-Type: multipart/form-data

Body:
- pdf: File
- degrees: number (90|180|270)
```

### QR Code Endpoints

#### Generate QR Code
```
POST /api/qr/generate
Content-Type: application/json

Body:
{
  "data": "string",
  "format": "png|svg",
  "size": 300,
  "margin": 1,
  "errorCorrectionLevel": "L|M|Q|H",
  "color": {
    "dark": "#000000",
    "light": "#FFFFFF"
  }
}
```

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **File Size Limits** - Configurable upload limits
- **Compression** - Gzip compression for responses

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/
│   │   ├── pdfController.ts
│   │   └── qrController.ts
│   ├── routes/
│   │   ├── pdfRoutes.ts
│   │   └── qrRoutes.ts
│   ├── services/
│   ├── middleware/
│   └── server.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## 🛠️ Tech Stack

- **Express** - Web framework
- **TypeScript** - Type safety
- **pdf-lib** - PDF manipulation
- **pdfjs-dist** - PDF rendering
- **sharp** - Image processing
- **multer** - File uploads
- **qrcode** - QR code generation

## 📝 License

MIT
