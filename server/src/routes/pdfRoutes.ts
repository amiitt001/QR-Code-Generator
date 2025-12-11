import { Router } from 'express';
import multer from 'multer';
import { 
  convertPDFToImages, 
  convertImagesToPDF,
  mergePDFs,
  splitPDF,
  compressPDF,
  rotatePDF,
  convertWordToPDF,
  convertPDFToWord
} from '../controllers/pdfController';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { 
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  }
});

// PDF to Images
router.post('/to-images', upload.single('pdf'), convertPDFToImages);

// Images to PDF
router.post('/from-images', upload.array('images', 20), convertImagesToPDF);

// Merge PDFs
router.post('/merge', upload.array('pdfs', 10), mergePDFs);

// Split PDF
router.post('/split', upload.single('pdf'), splitPDF);

// Compress PDF
router.post('/compress', upload.single('pdf'), compressPDF);

// Rotate PDF
router.post('/rotate', upload.single('pdf'), rotatePDF);

// Word to PDF
router.post('/word-to-pdf', upload.single('word'), convertWordToPDF);

// PDF to Word
router.post('/pdf-to-word', upload.single('pdf'), convertPDFToWord);

export default router;
