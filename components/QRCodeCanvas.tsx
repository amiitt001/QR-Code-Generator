import React, { forwardRef } from 'react';
import { QRCodeCanvas as ReactQRCodeCanvas } from 'qrcode.react';
import { QRSettings } from '../types';

interface QRCodeCanvasProps {
  settings: QRSettings;
}

// Forward ref to allow parent to access the canvas DOM element for downloading
export const QRCodeCanvas = forwardRef<HTMLCanvasElement, QRCodeCanvasProps>(({ settings }, ref) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
      <ReactQRCodeCanvas
        ref={ref}
        value={settings.value}
        size={settings.size}
        fgColor={settings.fgColor}
        bgColor={settings.bgColor}
        level={settings.level}
        includeMargin={settings.includeMargin}
        imageSettings={settings.imageSettings}
        className="max-w-full h-auto"
      />
    </div>
  );
});

QRCodeCanvas.displayName = "QRCodeCanvas";