import React, { forwardRef, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QRSettings } from '../types';

interface QRCodeCanvasProps {
  settings: QRSettings;
}

// Forward ref to allow parent to access the canvas DOM element for downloading
export const QRCodeCanvas = forwardRef<HTMLCanvasElement, QRCodeCanvasProps>(({ settings }, ref) => {
  const localRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = (ref as React.RefObject<HTMLCanvasElement>)?.current || localRef.current;
    if (!canvas) return;

    const generateAndDraw = async () => {
      try {
        // 1. Generate QR Data (Modules)
        const qrData = QRCode.create(settings.value, {
          errorCorrectionLevel: settings.level,
        });
        
        const modules = qrData.modules;
        const moduleCount = modules.size;
        const margin = settings.includeMargin ? 4 : 0;
        const totalCount = moduleCount + (margin * 2);
        
        // 2. Set Canvas Size (High DPI support)
        const pixelRatio = window.devicePixelRatio || 1;
        const size = settings.size;
        
        canvas.width = size * pixelRatio;
        canvas.height = size * pixelRatio;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.scale(pixelRatio, pixelRatio);
        
        // 3. Draw Background
        ctx.fillStyle = settings.bgColor;
        ctx.fillRect(0, 0, size, size);
        
        // 4. Calculate Metrics
        const cellSize = size / totalCount;
        
        // 5. Excavation Logic (Check if logo exists and calculate blocked area)
        let excavateArea: { x: number, y: number, w: number, h: number } | null = null;
        let img: HTMLImageElement | null = null;

        if (settings.imageSettings && settings.imageSettings.src) {
           // We need to wait for image to load if we want to draw it, 
           // but for calculating excavation we just need settings.
           // However, let's load it first to ensure it's ready to draw on top.
           img = new Image();
           img.src = settings.imageSettings.src;
           img.crossOrigin = "Anonymous";
           await new Promise((resolve) => {
             if (img) img.onload = resolve;
             if (img) img.onerror = resolve; // Continue even if fails
           });

           if (settings.imageSettings.excavate) {
              const imgW = settings.imageSettings.width;
              const imgH = settings.imageSettings.height;
              // Center the image
              const imgX = (size - imgW) / 2;
              const imgY = (size - imgH) / 2;
              
              excavateArea = { x: imgX, y: imgY, w: imgW, h: imgH };
           }
        }

        // 6. Draw Modules
        ctx.fillStyle = settings.fgColor;
        
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (modules.get(row, col)) {
              const x = (col + margin) * cellSize;
              const y = (row + margin) * cellSize;
              
              // Check excavation
              if (excavateArea) {
                 // Simple bounding box check: center of the module
                 const cx = x + cellSize / 2;
                 const cy = y + cellSize / 2;
                 if (
                   cx >= excavateArea.x && 
                   cx <= excavateArea.x + excavateArea.w &&
                   cy >= excavateArea.y && 
                   cy <= excavateArea.y + excavateArea.h
                 ) {
                   continue;
                 }
              }

              // Draw based on style
              switch (settings.style) {
                case 'circle':
                  ctx.beginPath();
                  ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
                  ctx.fill();
                  break;
                case 'rounded':
                   // Round rect with radius
                   const radius = cellSize * 0.35;
                   ctx.beginPath();
                   if (ctx.roundRect) {
                     ctx.roundRect(x, y, cellSize, cellSize, radius);
                   } else {
                     // Fallback for older browsers
                     ctx.moveTo(x + radius, y);
                     ctx.lineTo(x + cellSize - radius, y);
                     ctx.quadraticCurveTo(x + cellSize, y, x + cellSize, y + radius);
                     ctx.lineTo(x + cellSize, y + cellSize - radius);
                     ctx.quadraticCurveTo(x + cellSize, y + cellSize, x + cellSize - radius, y + cellSize);
                     ctx.lineTo(x + radius, y + cellSize);
                     ctx.quadraticCurveTo(x, y + cellSize, x, y + cellSize - radius);
                     ctx.lineTo(x, y + radius);
                     ctx.quadraticCurveTo(x, y, x + radius, y);
                   }
                   ctx.fill();
                   break;
                case 'diamond':
                   // Rotated square
                   ctx.beginPath();
                   ctx.moveTo(x + cellSize / 2, y);
                   ctx.lineTo(x + cellSize, y + cellSize / 2);
                   ctx.lineTo(x + cellSize / 2, y + cellSize);
                   ctx.lineTo(x, y + cellSize / 2);
                   ctx.closePath();
                   ctx.fill();
                   break;
                case 'square':
                default:
                  // To avoid "gaps" between blocks in some rendering engines due to anti-aliasing,
                  // we can slightly overlap or just fill rect.
                  // Adding a tiny overlap (0.3px) helps remove white lines between blocks
                  ctx.fillRect(x, y, cellSize + 0.3, cellSize + 0.3);
                  break;
              }
            }
          }
        }

        // 7. Draw Image
        if (img && settings.imageSettings) {
           const imgW = settings.imageSettings.width;
           const imgH = settings.imageSettings.height;
           const imgX = (size - imgW) / 2;
           const imgY = (size - imgH) / 2;
           ctx.drawImage(img, imgX, imgY, imgW, imgH);
        }

      } catch (err) {
        console.error("Failed to generate QR code", err);
      }
    };

    generateAndDraw();
  }, [settings]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
      <canvas
        ref={ref || localRef}
        className="max-w-full h-auto"
        style={{ width: '100%' }}
      />
    </div>
  );
});

QRCodeCanvas.displayName = "QRCodeCanvas";