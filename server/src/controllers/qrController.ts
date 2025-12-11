import { Request, Response } from 'express';
import QRCode from 'qrcode';

/**
 * Generate QR Code
 */
export const generateQRCode = async (req: Request, res: Response) => {
  try {
    const { 
      data, 
      format = 'png', 
      size = 300, 
      margin = 1,
      errorCorrectionLevel = 'M',
      color = { dark: '#000000', light: '#FFFFFF' }
    } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const options = {
      width: parseInt(size),
      margin: parseInt(margin),
      errorCorrectionLevel,
      color
    };

    if (format === 'svg') {
      const svgString = await QRCode.toString(data, { ...options, type: 'svg' });
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svgString);
    } else {
      const dataUrl = await QRCode.toDataURL(data, options);
      res.json({
        success: true,
        qrCode: dataUrl
      });
    }
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

/**
 * Scan/Decode QR Code
 */
export const scanQRCode = async (req: Request, res: Response) => {
  try {
    // This would require image processing and QR decoding
    // Using a library like jsqr or similar
    res.status(501).json({ 
      error: 'QR scanning not implemented yet',
      message: 'This feature requires additional image processing libraries'
    });
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({ error: 'Failed to scan QR code' });
  }
};
