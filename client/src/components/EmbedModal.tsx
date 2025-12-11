import React, { useState } from 'react';
import { X, Copy, CheckCircle2, Code } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataUrl: string;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose, dataUrl }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const embedCode = `<img src="${dataUrl}" alt="QR Code" style="display: block; width: 200px; height: 200px;" />`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-200 animate-in fade-in zoom-in-95">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570]" />

        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#1F1F1F] flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-[#0B57D0] rounded-xl">
               <Code size={20} />
            </div>
            Embed QR Code
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#444746]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview Section */}
          <div className="flex flex-col sm:flex-row gap-6">
             <div className="flex-shrink-0 flex flex-col items-center space-y-2">
                <span className="text-xs font-bold text-[#444746] uppercase tracking-widest">Preview</span>
                <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                   <img src={dataUrl} alt="QR Preview" className="w-32 h-32 object-contain" />
                </div>
             </div>

             <div className="flex-1 space-y-3">
                <label className="text-sm font-semibold text-[#444746] ml-1">HTML Image Tag</label>
                <div className="relative group">
                  <textarea 
                    readOnly
                    value={embedCode}
                    className="w-full h-32 p-4 pr-12 bg-[#F8FAFC] border border-gray-200 text-[#1F1F1F] font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B57D0]/20 focus:border-[#0B57D0] resize-none transition-all"
                  />
                  <button 
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[#444746] transition-colors shadow-sm"
                    title="Copy Code"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-[#0F5C2E]" /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-xs text-[#444746] leading-relaxed">
                  Copy this code to display the generated QR code directly on your website or application.
                </p>
             </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
           <button
             onClick={onClose}
             className="px-6 py-2.5 bg-[#1F1F1F] text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm text-sm"
           >
             Done
           </button>
        </div>
      </div>
    </div>
  );
};