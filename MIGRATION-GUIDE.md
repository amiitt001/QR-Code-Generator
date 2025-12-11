# Project Structure Guide

## 📁 Folder Organization

```
QR-Code-Generator/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── server/                   # Backend Node.js API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── server.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                # This file
```

## 🚀 Getting Started

### 1. Move Client Files

Move the following files/folders to `client/`:
```bash
# From root to client/
- App.tsx
- components/
- pages/
- hooks/
- services/
- utils/
- index.tsx
- index.html
- index.css
- types.ts
- package.json
- tsconfig.json
- vite.config.ts
- tailwind.config.js
- postcss.config.js
- vercel.json
- .env
- .env.example
```

### 2. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 3. Configuration

**Server (.env):**
```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_key_here
```

### 4. Run Development Servers

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

## 🔄 Migration Steps

### Step 1: Create Client Folder Structure
```bash
mkdir -p client/src
mkdir -p client/public
```

### Step 2: Move Files
```bash
# Move source files
move components client/src/
move pages client/src/
move services client/src/
move hooks client/src/
move utils client/src/

# Move config files
move App.tsx client/src/
move index.tsx client/src/
move index.html client/
move index.css client/src/
move types.ts client/src/

# Move build configs
move package.json client/
move tsconfig.json client/
move vite.config.ts client/
move tailwind.config.js client/
move postcss.config.js client/
move vercel.json client/
```

### Step 3: Update Import Paths

In `client/vite.config.ts`:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  }
}
```

Update imports from:
```typescript
import { Component } from './components/Component';
```

To:
```typescript
import { Component } from '@/components/Component';
```

### Step 4: Update Client API Calls

Create `client/src/config/api.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = {
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

### Step 5: Update Package Scripts

**Root package.json:**
```json
{
  "scripts": {
    "install:all": "cd server && npm install && cd ../client && npm install",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "build": "npm run build:server && npm run build:client",
    "build:server": "cd server && npm run build",
    "build:client": "cd client && npm run build"
  }
}
```

## 📡 API Integration

Update client services to use server endpoints:

**Before (client-only):**
```typescript
// Direct client-side conversion
const result = await pdfConverter.convert(file);
```

**After (with server):**
```typescript
// Server-side conversion via API
const formData = new FormData();
formData.append('pdf', file);

const response = await fetch(`${API_URL}/api/pdf/to-images`, {
  method: 'POST',
  body: formData
});
```

## 🎯 Benefits

- **Separation of Concerns** - Clear frontend/backend separation
- **Scalability** - Independent deployment and scaling
- **Security** - Server-side processing of sensitive operations
- **Performance** - Heavy operations on server
- **Maintainability** - Easier to manage and update

## 📝 Next Steps

1. Move files to appropriate folders
2. Update import paths
3. Configure environment variables
4. Test both client and server
5. Update deployment configurations

## 🚢 Deployment

**Client (Vercel):**
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

**Server (Railway/Heroku/AWS):**
- Root directory: `server`
- Build command: `npm run build`
- Start command: `npm start`
