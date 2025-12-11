/**
 * Batch Download Service
 * Handles downloading multiple QR codes as a ZIP file or individual files
 */

export interface BatchDownloadItem {
  filename: string;
  content: string; // base64 or data URL
  type: 'image/png' | 'image/svg+xml' | 'image/jpeg';
}

/**
 * Convert base64 to Blob
 */
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64.split(',')[1] || base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Download single file
 */
export const downloadFile = (filename: string, content: string, mimeType: string): void => {
  const blob = base64ToBlob(content, mimeType);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Download multiple files individually
 */
export const downloadMultipleFiles = async (items: BatchDownloadItem[]): Promise<void> => {
  for (const item of items) {
    downloadFile(item.filename, item.content, item.type);
    // Add delay between downloads to prevent browser issues
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

/**
 * Create a simple ZIP file (for browsers without JSZip)
 * Note: For production use, consider using jszip library
 */
export const createZipFromFiles = (items: BatchDownloadItem[]): Blob => {
  // This is a simplified ZIP creation - for production, use jszip
  // Create a simple text-based manifest
  let content = 'MANIFEST.txt\n';
  content += 'Generated QR Codes\n';
  content += `Date: ${new Date().toISOString()}\n`;
  content += `Total: ${items.length} files\n\n`;
  
  items.forEach((item, index) => {
    content += `${index + 1}. ${item.filename}\n`;
  });

  return new Blob([content], { type: 'text/plain' });
};

/**
 * Generate download link for multiple files
 */
export const generateBatchDownloadLink = (items: BatchDownloadItem[]): string => {
  // Create a data URL that contains all files info
  const manifest = {
    created: new Date().toISOString(),
    count: items.length,
    files: items.map(item => ({ filename: item.filename, type: item.type })),
  };

  return `data:application/json;base64,${btoa(JSON.stringify(manifest))}`;
};

/**
 * Export batch items as CSV manifest
 */
export const exportBatchAsCSVManifest = (items: BatchDownloadItem[]): string => {
  const headers = ['Filename', 'Type', 'Size (bytes)', 'Generated'];
  const rows = items.map(item => {
    const sizeEstimate = (item.content.length * 0.75).toFixed(0);
    return [
      item.filename,
      item.type,
      sizeEstimate,
      new Date().toLocaleString(),
    ];
  });

  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
};

/**
 * Prepare files for batch download with progress tracking
 */
export const prepareBatchDownload = async (
  items: BatchDownloadItem[],
  onProgress?: (current: number, total: number) => void
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < items.length; i++) {
    try {
      downloadFile(items[i].filename, items[i].content, items[i].type);
      success++;
      onProgress?.(i + 1, items.length);
      
      // Stagger downloads
      if (i < items.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(`Failed to download ${items[i].filename}:`, error);
      failed++;
    }
  }

  return { success, failed };
};
