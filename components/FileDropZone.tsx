import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle2, Loader2 } from 'lucide-react';

interface FileDropZoneProps {
  accept: string; // e.g. "image/*" or ".pdf"
  label: string;
  onFileSelect: (file: File) => void;
  maxSizeMB?: number;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ 
  accept, 
  label, 
  onFileSelect,
  maxSizeMB = 50 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    
    // Check size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`);
      return;
    }

    // Check type (simple check based on accept prop)
    // In a real app, you'd want more robust mime-type checking
    if (accept === 'image/*' && !selectedFile.type.startsWith('image/')) {
       setError('Please upload an image file.');
       return;
    }

    setFile(selectedFile);
    setUploading(true);
    
    // Simulate upload delay for better UX
    setTimeout(() => {
      setUploading(false);
      onFileSelect(selectedFile);
    }, 1500);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, [maxSizeMB, accept, onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-3">
      <div 
        className={`relative group border-2 border-dashed rounded-2xl transition-all duration-300 p-8 text-center cursor-pointer overflow-hidden ${
          isDragging 
            ? 'border-[#0B57D0] bg-[#0B57D0]/5 scale-[0.99]' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-200 hover:border-[#0B57D0]/50 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept={accept} 
          onChange={handleChange}
        />

        {file ? (
          <div className="relative z-10 flex flex-col items-center animate-in zoom-in-50 duration-300">
             {uploading ? (
               <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                  <Loader2 className="animate-spin text-[#0B57D0]" size={32} />
               </div>
             ) : (
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <CheckCircle2 className="text-green-600" size={32} />
               </div>
             )}
             
             <div className="space-y-1 max-w-[200px]">
               <p className="font-semibold text-gray-900 truncate">
                 {file.name}
               </p>
               <p className="text-xs text-gray-500">
                 {uploading ? 'Uploading...' : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
               </p>
             </div>

             {!uploading && (
                <button 
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                >
                  Remove File
                </button>
             )}
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center pointer-events-none">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              isDragging ? 'bg-blue-100 text-[#0B57D0]' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-[#0B57D0]'
            }`}>
              <UploadCloud size={28} />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">
              {isDragging ? 'Drop to upload' : `Click or drop ${label}`}
            </h4>
            <p className="text-sm text-gray-500">
              Max file size {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
           <X size={16} />
           {error}
        </div>
      )}
    </div>
  );
};