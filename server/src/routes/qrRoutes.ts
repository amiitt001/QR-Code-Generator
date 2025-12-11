import { Router } from 'express';
import { generateQRCode, scanQRCode } from '../controllers/qrController';

const router = Router();

// Generate QR Code
router.post('/generate', generateQRCode);

// Scan/Decode QR Code
router.post('/scan', scanQRCode);

export default router;
