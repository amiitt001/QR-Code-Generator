import React, { useEffect, useRef, useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  File as FileIcon, 
  ArrowRight,
  Trash2,
  Settings,
  ArrowUp,
  ArrowDown,
  Eye,
  Scissors
} from 'lucide-react';
import { pdfConverterService, ImageFormat } from '../services/pdfConverterService';

type ConversionType = 
  | 'pdf-to-images'
  | 'images-to-pdf'
  | 'pdf-to-word'
  | 'word-to-pdf'
  | 'pdf-to-text';

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

type ResultItem = {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'text';
};

type CropRect = { top: number; left: number; width: number; height: number };
type CropState = {
  fileId: string;
  imgUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  rect: CropRect;
};

export const PDFConverter: React.FC = () => {
  const [conversionType, setConversionType] = useState<ConversionType>('pdf-to-images');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [imageFormat, setImageFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(95);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Legal'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [outputName, setOutputName] = useState('converted.pdf');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [crops, setCrops] = useState<Record<string, CropRect>>({});
  const [cropState, setCropState] = useState<CropState | null>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversionOptions = [
    { id: 'pdf-to-images', label: 'PDF to Images', icon: ImageIcon, accept: '.pdf' },
    { id: 'images-to-pdf', label: 'Images to PDF', icon: FileText, accept: 'image/*' },
    { id: 'pdf-to-word', label: 'PDF to Word', icon: FileText, accept: '.pdf' },
    { id: 'word-to-pdf', label: 'Word to PDF', icon: FileText, accept: '.doc,.docx' },
    { id: 'pdf-to-text', label: 'PDF to Text', icon: FileIcon, accept: '.pdf' },
  ];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const newFiles: UploadedFile[] = await Promise.all(
      files.map(async (file) => {
        const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        let preview: string | undefined;

        if (file.type.startsWith('image/')) {
          preview = await pdfConverterService.fileToDataUrl(file);
        }

        return { file, id, preview };
      })
    );

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const input = fileInputRef.current;
    if (input) {
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const moveFile = (id: string, direction: 'up' | 'down') => {
    if (conversionType !== 'images-to-pdf') return;
    const index = uploadedFiles.findIndex((f) => f.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= uploadedFiles.length) return;
    const reordered = [...uploadedFiles];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setUploadedFiles(reordered);
  };

  const handleDownload = (item: ResultItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateResultName = (id: string, name: string) => {
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
  };

  const reorderById = (sourceId: string, targetId: string) => {
    if (conversionType !== 'images-to-pdf') return;
    const sourceIndex = uploadedFiles.findIndex((f) => f.id === sourceId);
    const targetIndex = uploadedFiles.findIndex((f) => f.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) return;
    const reordered = [...uploadedFiles];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setUploadedFiles(reordered);
  };

  const openCropper = async (fileId: string) => {
    const fileEntry = uploadedFiles.find((f) => f.id === fileId);
    if (!fileEntry) return;
    const dataUrl = fileEntry.preview || (await pdfConverterService.fileToDataUrl(fileEntry.file));
    const img = new window.Image();
    img.src = dataUrl;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });

    setCropState({
      fileId,
      imgUrl: dataUrl,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      rect: crops[fileId] || { top: 0, left: 0, width: 100, height: 100 },
    });
  };

  const updateCropRect = (partial: Partial<CropRect>) => {
    setCropState((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        rect: {
          ...prev.rect,
          ...partial,
        },
      };
      // Clamp values to 0..100 and keep width/height positive
      next.rect.top = Math.min(100, Math.max(0, next.rect.top));
      next.rect.left = Math.min(100, Math.max(0, next.rect.left));
      next.rect.width = Math.min(100, Math.max(1, next.rect.width));
      next.rect.height = Math.min(100, Math.max(1, next.rect.height));
      if (next.rect.left + next.rect.width > 100) {
        next.rect.width = 100 - next.rect.left;
      }
      if (next.rect.top + next.rect.height > 100) {
        next.rect.height = 100 - next.rect.top;
      }
      return next;
    });
  };

  const applyCropToFile = async (file: File, crop: CropRect): Promise<File> => {
    const dataUrl = await pdfConverterService.fileToDataUrl(file);
    const img = new window.Image();
    img.src = dataUrl;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });

    const sx = (crop.left / 100) * img.naturalWidth;
    const sy = (crop.top / 100) * img.naturalHeight;
    const sw = (crop.width / 100) * img.naturalWidth;
    const sh = (crop.height / 100) * img.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    const mime = file.type.includes('png') ? 'image/png' : 'image/jpeg';
    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Crop failed'))), mime, 0.95);
    });
    return new File([blob], file.name, { type: mime });
  };

  const saveCrop = async () => {
    if (!cropState) return;
    const { fileId, rect } = cropState;
    const fileEntry = uploadedFiles.find((f) => f.id === fileId);
    if (!fileEntry) return;
    const croppedFile = await applyCropToFile(fileEntry.file, rect);
    const preview = await pdfConverterService.fileToDataUrl(croppedFile);
    setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, file: croppedFile, preview } : f)));
    setCrops((prev) => ({ ...prev, [fileId]: rect }));
    setCropState(null);
  };

  const handleConvert = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload files first');
      return;
    }

    setIsConverting(true);
    setResults([]);

    try {
      switch (conversionType) {
        case 'pdf-to-images':
          const pdfFile = uploadedFiles[0].file;
          const imageResults = await pdfConverterService.pdfToImages(pdfFile, imageFormat, quality / 100);

          const successItems = imageResults
            .filter((result) => result.success && result.data)
            .map((result, index) => ({
              id: `img-${Date.now()}-${index}`,
              name: result.filename || `${pdfFile.name.replace('.pdf', '')}_page_${index + 1}.${imageFormat}`,
              url: URL.createObjectURL(result.data as Blob),
              type: 'image' as const,
            }));

          if (successItems.length === 0) {
            alert('Conversion failed. Please try again.');
          } else {
            setResults(successItems);
          }
          break;

        case 'images-to-pdf':
          const imageFiles = await Promise.all(
            uploadedFiles.map(async (f) => {
              const crop = crops[f.id];
              return crop ? await applyCropToFile(f.file, crop) : f.file;
            })
          );
          const pdfResult = await pdfConverterService.imagesToPdf(imageFiles, {
            pageSize,
            orientation,
            margin: 20
          });

          if (pdfResult.success && pdfResult.data instanceof Blob) {
            const filename = (outputName || pdfResult.filename || 'converted.pdf').trim();
            setResults([{
              id: `pdf-${Date.now()}`,
              name: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
              url: URL.createObjectURL(pdfResult.data),
              type: 'pdf'
            }]);
          } else {
            alert(pdfResult.error || 'PDF creation failed');
          }
          break;

        case 'pdf-to-word':
          const pdfToWord = await pdfConverterService.pdfToWord(uploadedFiles[0].file);
          if (pdfToWord.success && pdfToWord.data) {
            const url = typeof pdfToWord.data === 'string'
              ? pdfToWord.data
              : URL.createObjectURL(pdfToWord.data);
            setResults([{
              id: `doc-${Date.now()}`,
              name: pdfToWord.filename || 'converted.docx',
              url,
              type: 'text'
            }]);
          } else {
            alert(pdfToWord.error);
          }
          break;

        case 'word-to-pdf':
          const wordToPdf = await pdfConverterService.wordToPdf(uploadedFiles[0].file);
          if (wordToPdf.success && wordToPdf.data instanceof Blob) {
            setResults([{
              id: `wordpdf-${Date.now()}`,
              name: wordToPdf.filename || 'converted.pdf',
              url: URL.createObjectURL(wordToPdf.data),
              type: 'pdf'
            }]);
          } else {
            alert(wordToPdf.error);
          }
          break;

        case 'pdf-to-text':
          const textResult = await pdfConverterService.pdfToText(uploadedFiles[0].file);
          if (textResult.success && textResult.data) {
            const blob = typeof textResult.data === 'string' 
              ? new Blob([textResult.data], { type: 'text/plain' })
              : textResult.data;
            setResults([{
              id: `txt-${Date.now()}`,
              name: textResult.filename || 'extracted.txt',
              url: URL.createObjectURL(blob),
              type: 'text'
            }]);
          } else {
            alert(textResult.error);
          }
          break;
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const currentOption = conversionOptions.find(opt => opt.id === conversionType);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">PDF Converter</h1>
        <p className="text-gray-600">Convert PDFs to images, Word documents, and more</p>
      </div>

      {/* Conversion Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {conversionOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => {
                setConversionType(option.id as ConversionType);
                setUploadedFiles([]);
                setResults([]);
                setOutputName('converted.pdf');
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                conversionType === option.id
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <Icon 
                size={24} 
                className={`mx-auto mb-2 ${
                  conversionType === option.id ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
              <p className={`text-sm font-medium ${
                conversionType === option.id ? 'text-blue-900' : 'text-gray-700'
              }`}>
                {option.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Settings Panel */}
      {conversionType === 'pdf-to-images' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Image Settings</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select
                value={imageFormat}
                onChange={(e) => setImageFormat(e.target.value as ImageFormat)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {cropState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Crop Image</h3>
              <button
                onClick={() => setCropState(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-600 mb-2">Drag corners/edges to resize, drag center to move</div>
                <div className="relative w-full overflow-hidden rounded-md bg-white border border-gray-200">
                  <img
                    src={cropState.imgUrl}
                    alt="Crop preview"
                    className="w-full select-none"
                    draggable={false}
                  />
                  
                  {/* Crop overlay with drag handlers */}
                  <div
                    className="absolute border-2 border-blue-500/80 bg-blue-500/10"
                    style={{
                      top: `${cropState.rect.top}%`,
                      left: `${cropState.rect.left}%`,
                      width: `${cropState.rect.width}%`,
                      height: `${cropState.rect.height}%`,
                    }}
                  >
                    {/* Center move handle */}
                    <div
                      className="absolute inset-0 cursor-move"
                      onMouseDown={(e) => {
                        if (e.button !== 0 || !e.currentTarget.parentElement?.parentElement) return;
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startRect = { ...cropState.rect };
                        const containerWidth = e.currentTarget.parentElement.parentElement.clientWidth;
                        const containerHeight = e.currentTarget.parentElement.parentElement.clientHeight;
                        
                        const onMove = (ev: MouseEvent) => {
                          const dx = ((ev.clientX - startX) / containerWidth) * 100;
                          const dy = ((ev.clientY - startY) / containerHeight) * 100;
                          updateCropRect({
                            left: Math.max(0, startRect.left + dx),
                            top: Math.max(0, startRect.top + dy),
                          });
                        };
                        const onUp = () => {
                          window.removeEventListener('mousemove', onMove);
                          window.removeEventListener('mouseup', onUp);
                        };
                        window.addEventListener('mousemove', onMove);
                        window.addEventListener('mouseup', onUp);
                      }}
                    >
                      <div className="absolute inset-0 border border-white/60" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-6 h-6 border-2 border-white/40 rounded-full" />
                      </div>
                    </div>

                    {/* Resize handles - corners */}
                    {[
                      { corner: 'tl', cursor: 'nw-resize', style: { top: 0, left: 0, transform: 'translate(-50%, -50%)' } },
                      { corner: 'tr', cursor: 'ne-resize', style: { top: 0, right: 0, transform: 'translate(50%, -50%)' } },
                      { corner: 'bl', cursor: 'sw-resize', style: { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' } },
                      { corner: 'br', cursor: 'se-resize', style: { bottom: 0, right: 0, transform: 'translate(50%, 50%)' } },
                    ].map(({ corner, cursor, style }) => (
                      <div
                        key={corner}
                        className="absolute w-3 h-3 bg-blue-600 rounded-full"
                        style={{ ...style, cursor }}
                        onMouseDown={(e) => {
                          if (e.button !== 0 || !e.currentTarget.parentElement?.parentElement) return;
                          e.stopPropagation();
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const startRect = { ...cropState.rect };
                          const containerWidth = e.currentTarget.parentElement.parentElement.clientWidth;
                          const containerHeight = e.currentTarget.parentElement.parentElement.clientHeight;

                          const onMove = (ev: MouseEvent) => {
                            const dx = ((ev.clientX - startX) / containerWidth) * 100;
                            const dy = ((ev.clientY - startY) / containerHeight) * 100;
                            const newRect = { ...startRect };

                            if (corner.includes('t')) newRect.top = Math.max(0, startRect.top + dy);
                            if (corner.includes('b')) newRect.height = Math.max(1, startRect.height + dy);
                            if (corner.includes('l')) newRect.left = Math.max(0, startRect.left + dx);
                            if (corner.includes('r')) newRect.width = Math.max(1, startRect.width + dx);

                            // Keep within bounds
                            if (newRect.left + newRect.width > 100) newRect.width = 100 - newRect.left;
                            if (newRect.top + newRect.height > 100) newRect.height = 100 - newRect.top;

                            updateCropRect(newRect);
                          };
                          const onUp = () => {
                            window.removeEventListener('mousemove', onMove);
                            window.removeEventListener('mouseup', onUp);
                          };
                          window.addEventListener('mousemove', onMove);
                          window.addEventListener('mouseup', onUp);
                        }}
                      />
                    ))}

                    {/* Resize handles - edges */}
                    {[
                      { edge: 'top', cursor: 'ns-resize', style: { top: 0, left: '25%', width: '50%', height: 4, transform: 'translateY(-50%)' } },
                      { edge: 'bottom', cursor: 'ns-resize', style: { bottom: 0, left: '25%', width: '50%', height: 4, transform: 'translateY(50%)' } },
                      { edge: 'left', cursor: 'ew-resize', style: { left: 0, top: '25%', width: 4, height: '50%', transform: 'translateX(-50%)' } },
                      { edge: 'right', cursor: 'ew-resize', style: { right: 0, top: '25%', width: 4, height: '50%', transform: 'translateX(50%)' } },
                    ].map(({ edge, cursor, style }) => (
                      <div
                        key={edge}
                        className="absolute bg-blue-500/50 hover:bg-blue-600"
                        style={{ ...style, cursor }}
                        onMouseDown={(e) => {
                          if (e.button !== 0 || !e.currentTarget.parentElement?.parentElement) return;
                          e.stopPropagation();
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const startRect = { ...cropState.rect };
                          const containerWidth = e.currentTarget.parentElement.parentElement.clientWidth;
                          const containerHeight = e.currentTarget.parentElement.parentElement.clientHeight;

                          const onMove = (ev: MouseEvent) => {
                            const dx = ((ev.clientX - startX) / containerWidth) * 100;
                            const dy = ((ev.clientY - startY) / containerHeight) * 100;
                            const newRect = { ...startRect };

                            if (edge === 'top') newRect.top = Math.max(0, startRect.top + dy);
                            if (edge === 'bottom') newRect.height = Math.max(1, startRect.height + dy);
                            if (edge === 'left') newRect.left = Math.max(0, startRect.left + dx);
                            if (edge === 'right') newRect.width = Math.max(1, startRect.width + dx);

                            if (newRect.left + newRect.width > 100) newRect.width = 100 - newRect.left;
                            if (newRect.top + newRect.height > 100) newRect.height = 100 - newRect.top;

                            updateCropRect(newRect);
                          };
                          const onUp = () => {
                            window.removeEventListener('mousemove', onMove);
                            window.removeEventListener('mouseup', onUp);
                          };
                          window.addEventListener('mousemove', onMove);
                          window.addEventListener('mouseup', onUp);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600">Top (%)</label>
                    <input
                      type="number"
                      value={cropState.rect.top}
                      onChange={(e) => updateCropRect({ top: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Left (%)</label>
                    <input
                      type="number"
                      value={cropState.rect.left}
                      onChange={(e) => updateCropRect({ left: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Width (%)</label>
                    <input
                      type="number"
                      value={cropState.rect.width}
                      onChange={(e) => updateCropRect({ width: parseFloat(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Height (%)</label>
                    <input
                      type="number"
                      value={cropState.rect.height}
                      onChange={(e) => updateCropRect({ height: parseFloat(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={saveCrop}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    Apply Crop
                  </button>
                  <button
                    onClick={() => setCropState(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
                <div className="text-xs text-gray-600">
                  Crop is stored per image. We apply crops before building the PDF.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {conversionType === 'images-to-pdf' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">PDF Settings</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as 'A4' | 'Letter' | 'Legal')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Output filename</label>
              <input
                type="text"
                value={outputName}
                onChange={(e) => setOutputName(e.target.value)}
                placeholder="converted.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop your files here or click to browse
        </p>
        <p className="text-sm text-gray-600">
          Accepted: {currentOption?.accept}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple={conversionType === 'images-to-pdf'}
          accept={currentOption?.accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.id}
                draggable={conversionType === 'images-to-pdf' && uploadedFiles.length > 1}
                onDragStart={() => conversionType === 'images-to-pdf' && setDraggingId(file.id)}
                onDragOver={(e) => {
                  if (conversionType !== 'images-to-pdf' || !draggingId) return;
                  e.preventDefault();
                  reorderById(draggingId, file.id);
                }}
                onDragEnd={() => setDraggingId(null)}
                onDrop={(e) => {
                  if (conversionType !== 'images-to-pdf' || !draggingId) return;
                  e.preventDefault();
                  reorderById(draggingId, file.id);
                  setDraggingId(null);
                }}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors bg-gray-50 ${
                  draggingId === file.id ? 'border-blue-400 bg-blue-50' : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center">
                      <FileText className="text-blue-600" size={24} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.file.name}</p>
                    <p className="text-sm text-gray-600">
                      {pdfConverterService.getFileSizeString(file.file.size)}
                    </p>
                    {conversionType === 'images-to-pdf' && uploadedFiles.length > 1 && (
                      <p className="text-xs text-blue-700 mt-1">Drag to reorder pages</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {conversionType === 'images-to-pdf' && uploadedFiles.length > 1 && (
                    <div className="flex flex-col gap-1 mr-2">
                      <button
                        onClick={() => moveFile(file.id, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40"
                        aria-label="Move up"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => moveFile(file.id, 'down')}
                        disabled={index === uploadedFiles.length - 1}
                        className="p-1 rounded border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40"
                        aria-label="Move down"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  )}
                  {conversionType === 'images-to-pdf' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openCropper(file.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          crops[file.id]
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        title={crops[file.id] ? 'Click to re-crop' : 'Click to crop'}
                      >
                        <Scissors size={18} />
                      </button>
                      {crops[file.id] && (
                        <button
                          onClick={() => {
                            setCrops((prev) => {
                              const updated = { ...prev };
                              delete updated[file.id];
                              return updated;
                            });
                            setUploadedFiles((prev) =>
                              prev.map((f) => {
                                if (f.id === file.id) {
                                  return {
                                    ...f,
                                    preview: f.preview ? f.preview.split('?')[0] : f.preview,
                                  };
                                }
                                return f;
                              })
                            );
                          }}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Restore original"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Convert Button */}
      {uploadedFiles.length > 0 && (
        <button
          onClick={handleConvert}
          disabled={isConverting}
          className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isConverting ? (
            <>
              <RefreshCw size={24} className="animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <ArrowRight size={24} />
              Convert & Preview
            </>
          )}
        </button>
      )}

      {/* Preview & Download */}
      {results.length > 0 && (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-gray-900">Preview & Download</h3>
              <p className="text-sm text-gray-600">Review results, rename, and download when ready.</p>
            </div>
            <div className="text-sm text-gray-500">Downloads are manual to keep files in preview first.</div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 bg-gray-50">
                <div className="text-sm font-medium text-gray-800 truncate" title={item.name}>{item.name}</div>
                {item.type === 'image' && (
                  <img src={item.url} alt={item.name} className="w-full h-48 object-contain bg-white rounded" />
                )}
                {item.type === 'pdf' && (
                  <div className="relative w-full h-48 bg-white rounded overflow-hidden">
                    <iframe title={item.name} src={item.url} className="absolute inset-0 w-full h-full border-0" />
                  </div>
                )}
                {item.type === 'text' && (
                  <div className="w-full h-48 bg-white rounded p-3 overflow-auto text-sm text-gray-700 whitespace-pre-wrap">Preview unavailable. Click preview to open.</div>
                )}

                <div className="space-y-2">
                  <label className="text-xs text-gray-600">Filename</label>
                  <input
                    value={item.name}
                    onChange={(e) => updateResultName(item.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(item)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white"
                  >
                    <Eye size={16} />
                    Preview
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Notice */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="text-sm text-blue-900">
          <p className="mb-2">
            <strong>Note:</strong> All PDF operations run client-side using these libraries:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li><strong>pdf.js</strong> - For PDF to image conversion</li>
            <li><strong>jsPDF</strong> - For creating PDFs from images</li>
            <li><strong>pdf-lib</strong> - For advanced PDF manipulation</li>
          </ul>
          <p className="mt-3">
            All processing happens in your browser. Your files never leave your device.
          </p>
        </div>
      </div>
    </div>
  );
};
