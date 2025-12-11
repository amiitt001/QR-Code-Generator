import { Request, Response } from 'express';
import { PDFDocument, degrees as pdfDegrees } from 'pdf-lib';
import sharp from 'sharp';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';
import { JSDOM } from 'jsdom';

// Node: process without a worker; don't set workerSrc to avoid type errors

/**
 * Convert PDF to Images
 */
export const convertPDFToImages = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { format = 'png', quality = 95, scale = 2 } = req.body;
    const pdfBuffer = req.file.buffer;

    // Load PDF
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdf = await loadingTask.promise;

    const images: Buffer[] = [];

    // Convert each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: parseFloat(scale) });

      const canvas = {
        width: viewport.width,
        height: viewport.height
      };

      // Render page to canvas (simplified - needs proper canvas implementation)
      // This is a placeholder - full implementation requires canvas
      const imageBuffer = Buffer.from('placeholder');
      images.push(imageBuffer);
    }

    res.json({
      success: true,
      images: images.map((img, idx) => ({
        page: idx + 1,
        data: img.toString('base64')
      }))
    });
  } catch (error) {
    console.error('PDF to images error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to images' });
  }
};

/**
 * Convert Images to PDF
 */
export const convertImagesToPDF = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const { pageSize = 'A4', orientation = 'portrait' } = req.body;
    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      // Process image with sharp
      const imageBuffer = await sharp(file.buffer)
        .resize(2480, 3508, { fit: 'inside' }) // A4 size at 300 DPI
        .toBuffer();

      let image;
      if (file.mimetype.includes('png')) {
        image = await pdfDoc.embedPng(imageBuffer);
      } else {
        image = await pdfDoc.embedJpg(imageBuffer);
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
      });
    }

    const pdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Images to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert images to PDF' });
  }
};

/**
 * Merge PDFs
 */
export const mergePDFs = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No PDF files uploaded' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    console.error('PDF merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDFs' });
  }
};

/**
 * Split PDF
 */
export const splitPDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pageCount = pdfDoc.getPageCount();
    const pdfs: Buffer[] = [];

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      
      const pdfBytes = await newPdf.save();
      pdfs.push(Buffer.from(pdfBytes));
    }

    res.json({
      success: true,
      pages: pdfs.map((pdf, idx) => ({
        page: idx + 1,
        data: pdf.toString('base64')
      }))
    });
  } catch (error) {
    console.error('PDF split error:', error);
    res.status(500).json({ error: 'Failed to split PDF' });
  }
};

/**
 * Compress PDF
 */
export const compressPDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true
    });

    const originalSize = req.file.buffer.length;
    const compressedSize = compressedPdfBytes.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
    res.setHeader('X-Original-Size', originalSize.toString());
    res.setHeader('X-Compressed-Size', compressedSize.toString());
    res.setHeader('X-Compression-Ratio', compressionRatio);
    res.send(Buffer.from(compressedPdfBytes));
  } catch (error) {
    console.error('PDF compression error:', error);
    res.status(500).json({ error: 'Failed to compress PDF' });
  }
};

/**
 * Rotate PDF
 */
export const rotatePDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { degrees: rotationDegrees = 90 } = req.body;
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();

    pages.forEach(page => {
      page.setRotation(pdfDegrees(parseInt(rotationDegrees)));
    });

    const rotatedPdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rotated.pdf');
    res.send(Buffer.from(rotatedPdfBytes));
  } catch (error) {
    console.error('PDF rotation error:', error);
    res.status(500).json({ error: 'Failed to rotate PDF' });
  }
};

/**
 * Convert Word (DOCX) to PDF
 */
export const convertWordToPDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No Word file uploaded' });
    }

    if (!req.file.mimetype.includes('document') && !req.file.originalname?.endsWith('.docx')) {
      return res.status(400).json({ error: 'Please upload a .docx Word document' });
    }

    // Convert DOCX to HTML using mammoth
    const { value: html } = await mammoth.convertToHtml({ buffer: req.file.buffer });

    // Create a basic PDF from HTML content using jsPDF with html2canvas
    // For now, we'll use a simpler approach: render to basic text-based PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    const fontSize = 12;
    const margin = 50;
    const lineHeight = 15;
    const maxWidth = 495;
    
    let yPosition = 800;
    
    // Parse basic HTML and extract text (simplified)
    const plainText = html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .split('\n')
      .filter(line => line.trim().length > 0);

    yPosition -= lineHeight * 2;

    for (const line of plainText) {
      if (yPosition < margin) {
        // Add new page
        pdfDoc.addPage([595, 842]);
        yPosition = 800;
      }

      page.drawText(line.trim().substring(0, 100), {
        x: margin,
        y: yPosition,
        size: fontSize
      });

      yPosition -= lineHeight;
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname?.replace('.docx', '.pdf') || 'converted.pdf'}"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Word to PDF conversion error:', error);
    res.status(500).json({ error: 'Failed to convert Word document to PDF', details: (error as Error).message });
  }
};

/**
 * Convert PDF to Word (DOCX)
 */
export const convertPDFToWord = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

      // Extract text from PDF using pdfjs-dist (no worker in Node)
      const pdf = await pdfjsLib.getDocument({ data: req.file.buffer, disableWorker: true } as any).promise;
      const pageParagraphs: Paragraph[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = (textContent.items as Array<{ str?: string }>);
        const pageText = textItems
          .map(item => item.str || '')
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        pageParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: `Page ${i}`, bold: true })],
            spacing: { after: 200 }
          })
        );

        pageParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: pageText || '[No extractable text on this page]',
                break: 1
              })
            ],
            spacing: { after: 300 }
          })
        );
      }

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'PDF Conversion Result', bold: true, size: 28 })
                ],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Source file: ${req.file.originalname}` })
                ],
                spacing: { after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Generated: ${new Date().toISOString()}` })
                ],
                spacing: { after: 200 }
              }),
              ...pageParagraphs
            ]
          }
        ]
      });

      const buffer = await Packer.toBuffer(doc);
      const filename = req.file.originalname?.replace(/\.pdf$/i, '.docx') || 'converted.docx';

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to Word', details: (error as Error).message });
  }
};
