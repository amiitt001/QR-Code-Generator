/**
 * Enhanced PDF Converter Service with Library Implementations
 * Implements actual conversion using jsPDF and pdf-lib
 */

import { jsPDF } from 'jspdf';
import { PDFDocument, RotationTypes } from 'pdf-lib';

// Initialize PDF.js worker once
let pdfjsInitialized = false;
async function initPdfJs() {
  if (pdfjsInitialized) return;
  
  const pdfjsLib = await import('pdfjs-dist');
  // Match the installed version 4.10.38
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
  pdfjsInitialized = true;
}

export interface ConversionProgress {
  current: number;
  total: number;
  status: string;
}

export const enhancedPDFConverter = {
  /**
   * Convert multiple images to a single PDF
   */
  async imagesToPDF(
    imageFiles: File[],
    options: {
      pageSize?: 'A4' | 'Letter' | 'Legal';
      orientation?: 'portrait' | 'landscape';
      margin?: number;
      compression?: boolean;
    } = {},
    onProgress?: (progress: ConversionProgress) => void
  ): Promise<Blob> {
    const { 
      pageSize = 'A4', 
      orientation = 'portrait', 
      margin = 10,
      compression = true 
    } = options;

    // Create new PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize.toLowerCase()
    });

    // Get page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const usableWidth = pageWidth - (margin * 2);
    const usableHeight = pageHeight - (margin * 2);

    for (let i = 0; i < imageFiles.length; i++) {
      onProgress?.({
        current: i + 1,
        total: imageFiles.length,
        status: `Processing image ${i + 1} of ${imageFiles.length}`
      });

      const file = imageFiles[i];
      const dataUrl = await this.fileToDataUrl(file);

      // Get image dimensions
      const img = await this.loadImage(dataUrl);
      const imgWidth = img.width;
      const imgHeight = img.height;

      // Calculate scaled dimensions to fit page
      let scaledWidth = usableWidth;
      let scaledHeight = (imgHeight * usableWidth) / imgWidth;

      if (scaledHeight > usableHeight) {
        scaledHeight = usableHeight;
        scaledWidth = (imgWidth * usableHeight) / imgHeight;
      }

      // Center the image
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;

      // Add new page if not first image
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to PDF
      const format = file.type.includes('png') ? 'PNG' : 'JPEG';
      pdf.addImage(dataUrl, format, x, y, scaledWidth, scaledHeight, undefined, compression ? 'FAST' : 'NONE');
    }

    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  },

  /**
   * Convert PDF to images using canvas
   */
  async pdfToImages(
    pdfFile: File,
    options: {
      format?: 'png' | 'jpeg';
      quality?: number;
      scale?: number;
    } = {}
  ): Promise<Blob[]> {
    const { format = 'png', quality = 0.95, scale = 2 } = options;

    try {
      // Initialize PDF.js worker
      await initPdfJs();
      const pdfjsLib = await import('pdfjs-dist');

      // Load PDF
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const images: Blob[] = [];

      // Convert each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render page
        await page.render({
          canvasContext: context,
          viewport
        }).promise;

        // Convert to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas to blob conversion failed'));
            },
            `image/${format}`,
            quality
          );
        });

        images.push(blob);
      }

      return images;
    } catch (error) {
      console.error('PDF to images conversion error:', error);
      throw new Error('Failed to convert PDF to images. Make sure pdf.js is properly loaded.');
    }
  },

  /**
   * Compress PDF
   */
  async compressPDF(pdfFile: File): Promise<Blob> {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Save with compression
      const compressedPdf = await pdfDoc.save({
        useObjectStreams: true,
      });

      return new Blob([new Uint8Array(compressedPdf)], { type: 'application/pdf' });
    } catch (error) {
      console.error('PDF compression error:', error);
      throw new Error('Failed to compress PDF');
    }
  },

  /**
   * Merge multiple PDFs
   */
  async mergePDFs(pdfFiles: File[]): Promise<Blob> {
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of pdfFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      return new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
    } catch (error) {
      console.error('PDF merge error:', error);
      throw new Error('Failed to merge PDFs');
    }
  },

  /**
   * Split PDF into separate pages
   */
  async splitPDF(pdfFile: File): Promise<Blob[]> {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      const pdfs: Blob[] = [];

      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        
        const pdfBytes = await newPdf.save();
        pdfs.push(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
      }

      return pdfs;
    } catch (error) {
      console.error('PDF split error:', error);
      throw new Error('Failed to split PDF');
    }
  },

  /**
   * Rotate PDF pages
   */
  async rotatePDF(pdfFile: File, degrees: 90 | 180 | 270): Promise<Blob> {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const radians = (degrees * Math.PI) / 180;
        page.setRotation({ type: RotationTypes.Radians, angle: radians });
      });

      const rotatedPdfBytes = await pdfDoc.save();
      return new Blob([new Uint8Array(rotatedPdfBytes)], { type: 'application/pdf' });
    } catch (error) {
      console.error('PDF rotation error:', error);
      throw new Error('Failed to rotate PDF');
    }
  },

  /**
   * Helper: Load image from data URL
   */
  loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  },

  /**
   * Helper: Convert file to data URL
   */
  fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Helper: Download blob as file
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
