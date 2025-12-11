import React from 'react';
import { QRGenerator } from '../components/QRGenerator';

export const QRPage: React.FC = () => {
  return (
    <div className="py-8">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#1F1F1F] mb-3">
            QR Code Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create custom QR codes with advanced features and AI assistance
          </p>
        </div>
        
        <QRGenerator />
      </div>
    </div>
  );
};
