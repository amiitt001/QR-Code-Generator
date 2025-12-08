import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, AlertCircle, Loader2 } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (decodedText: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScan }) => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(startScanner, 100);
    } else {
      stopScanner();
    }
  }, [isOpen]);

  const startScanner = async () => {
    try {
      setError(null);
      setIsScanning(true);

      if (scannerRef.current) {
        await stopScanner();
      }

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
      };

      await scanner.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (mountedRef.current) {
            onScan(decodedText);
            onClose();
          }
        },
        (errorMessage) => {
          // Ignore scanning errors as they happen every frame if no QR is found
        }
      );
    } catch (err) {
      if (mountedRef.current) {
        console.error("Error starting scanner:", err);
        setError("Could not access camera. Please ensure permissions are granted.");
        setIsScanning(false);
      }
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.warn("Failed to stop scanner:", err);
      }
      scannerRef.current = null;
    }
    if (mountedRef.current) {
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white z-10 relative">
          <h3 className="text-xl font-bold text-[#1F1F1F] flex items-center gap-2">
            <Camera className="text-[#0B57D0]" size={24} />
            Scan QR Code
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#444746]"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative bg-black h-[400px] flex items-center justify-center overflow-hidden">
          <div id="qr-reader" className="w-full h-full"></div>
          
          {/* Custom Overlay */}
          {!error && (
            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/50">
               <div className="w-full h-full border-2 border-[#0B57D0]/50 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#0B57D0]"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#0B57D0]"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#0B57D0]"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#0B57D0]"></div>
               </div>
            </div>
          )}

          {/* Loading State */}
          {!isScanning && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 bg-black">
               <Loader2 className="animate-spin" size={32} />
               <p className="text-sm font-medium">Starting Camera...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <p className="text-lg font-medium mb-2">Camera Error</p>
              <p className="text-gray-400 text-sm">{error}</p>
              <button 
                onClick={startScanner}
                className="mt-6 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white text-center">
          <p className="text-sm text-[#444746]">
            Point your camera at a QR code to automatically detect and edit its content.
          </p>
        </div>
      </div>
    </div>
  );
};