/**
 * PDF Conversion Service
 * Handles conversion between PDF and various image formats, and document formats
 */

import { enhancedPDFConverter } from './enhancedPDFConverter';

export interface ConversionResult {
  success: boolean;
  data?: string | Blob;
  filename?: string;
  error?: string;
}

export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif';
export type DocumentFormat = 'pdf' | 'word' | 'docx' | 'txt';

export const pdfConverterService = {
  /**
   * Convert PDF to images (individual pages)
   */
  async pdfToImages(
    pdfFile: File,
    format: ImageFormat = 'png',
    quality: number = 0.95
  ): Promise<ConversionResult[]> {
    try {
      // Use the enhanced PDF converter with actual implementation
      const imageBlobs = await enhancedPDFConverter.pdfToImages(pdfFile, {
        format: format === 'jpg' ? 'jpeg' : format,
        quality,
        scale: 2
      });

      const results: ConversionResult[] = imageBlobs.map((blob, index) => ({
        success: true,
        data: blob,
        filename: `${pdfFile.name.replace('.pdf', '')}_page_${index + 1}.${format}`
      }));

      return results;
    } catch (error) {
      return [{
        success: false,
        error: error instanceof Error ? error.message : 'PDF conversion failed'
      }];
    }
  },

  /**
   * Convert images to PDF
   */
  async imagesToPdf(
    imageFiles: File[],
    options: {
      pageSize?: 'A4' | 'Letter' | 'Legal';
      orientation?: 'portrait' | 'landscape';
      margin?: number;
    } = {}
  ): Promise<ConversionResult> {
    try {
      // Use the enhanced PDF converter with actual implementation
      const pdfBlob = await enhancedPDFConverter.imagesToPDF(imageFiles, {
        pageSize: options.pageSize,
        orientation: options.orientation,
        margin: options.margin,
        compression: true
      });

      return {
        success: true,
        data: pdfBlob,
        filename: 'converted.pdf'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image to PDF conversion failed'
      };
    }
  },

  /**
   * Convert PDF to Word (returns .txt extract)
   */
  async pdfToWord(pdfFile: File): Promise<ConversionResult> {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      // Get the API base URL (defaults to localhost:5000 in dev)
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Call server endpoint
      const response = await fetch(`${apiBaseUrl}/api/pdf/pdf-to-word`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error' }));
        return {
          success: false,
          error: errorData.error || `Server error: ${response.status}`
        };
      }

      // Get the text blob from response
      const textBlob = await response.blob();

      return {
        success: true,
        data: textBlob,
        filename: pdfFile.name.replace(/\.pdf$/i, '.txt')
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF to Word conversion failed. Is the server running on port 5000?'
      };
    }
  },

  /**
   * Convert Word to PDF
   */
  async wordToPdf(wordFile: File): Promise<ConversionResult> {
    try {
      // Validate file type
      if (!wordFile.type.includes('document') && !wordFile.name.endsWith('.docx')) {
        return {
          success: false,
          error: 'Please upload a .docx Word document'
        };
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('word', wordFile);

      // Get the API base URL (defaults to localhost:5000 in dev)
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Call server endpoint
      const response = await fetch(`${apiBaseUrl}/api/pdf/word-to-pdf`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error' }));
        return {
          success: false,
          error: errorData.error || `Server error: ${response.status}`
        };
      }

      // Get the PDF blob from response
      const pdfBlob = await response.blob();

      return {
        success: true,
        data: pdfBlob,
        filename: wordFile.name.replace('.docx', '.pdf')
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Word to PDF conversion failed'
      };
    }
  },

  /**
   * Convert PDF to Text
   */
  async pdfToText(pdfFile: File): Promise<ConversionResult> {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      // Requires pdf.js for text extraction
      return {
        success: false,
        error: 'PDF text extraction requires pdf.js library'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF to text conversion failed'
      };
    }
  },

  /**
   * Helper: Convert File to DataURL
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
   * Helper: Download result
   */
  downloadResult(result: ConversionResult): void {
    if (!result.success || !result.data || !result.filename) {
      console.error('Cannot download:', result.error);
      return;
    }

    const blob = result.data instanceof Blob 
      ? result.data 
      : this.dataUrlToBlob(result.data as string);

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Helper: Convert DataURL to Blob
   */
  dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },

  /**
   * Validate file type
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => 
      file.type.includes(type) || file.name.toLowerCase().endsWith(type)
    );
  },

  /**
   * Get file size in human readable format
   */
  getFileSizeString(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
};
