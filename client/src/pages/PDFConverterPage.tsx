import React from 'react';
import { PDFConverter } from '../components/PDFConverter';

export const PDFConverterPage: React.FC = () => {
  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#1F1F1F] mb-3">
            PDF Converter & Tools
          </h1>
          <p className="text-lg text-gray-600">
            Convert, merge, split, compress and manipulate PDFs with powerful tools
          </p>
        </div>
        
        <PDFConverter />
      </div>
    </div>
  );
};
