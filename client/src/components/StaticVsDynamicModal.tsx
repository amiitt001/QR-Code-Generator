import React from 'react';
import { X, Check, X as XIcon, Zap, Shield, ServerOff, Infinity } from 'lucide-react';

interface StaticVsDynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaticVsDynamicModal: React.FC<StaticVsDynamicModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#1F1F1F]">Static vs. Dynamic QR Codes</h2>
            <p className="text-[#444746] text-sm mt-1">Understanding why we chose Static for this tool.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#444746]"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 bg-[#F8FAFC]">
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Static Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-[#0B57D0] relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-[#0B57D0] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                 GENERATED HERE
               </div>
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-blue-50 text-[#0B57D0] rounded-xl">
                   <Zap size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-[#1F1F1F]">Static QR Code</h3>
               </div>
               <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                 Data is encoded directly into the pattern of the image. Like writing on paper, once created, it cannot be changed.
               </p>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-green-100 text-green-700 rounded-full"><Check size={12} strokeWidth={3} /></div>
                   <div>
                     <span className="block font-bold text-gray-900 text-sm">Permanent & Forever</span>
                     <span className="text-xs text-gray-500">Will never expire. Works as long as the image is intact.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-green-100 text-green-700 rounded-full"><Check size={12} strokeWidth={3} /></div>
                   <div>
                     <span className="block font-bold text-gray-900 text-sm">100% Private</span>
                     <span className="text-xs text-gray-500">No tracking servers. No middleman. Direct connection.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-green-100 text-green-700 rounded-full"><Check size={12} strokeWidth={3} /></div>
                   <div>
                     <span className="block font-bold text-gray-900 text-sm">Zero Cost</span>
                     <span className="text-xs text-gray-500">Free to generate and use commercially forever.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-red-100 text-red-700 rounded-full"><XIcon size={12} strokeWidth={3} /></div>
                   <div>
                     <span className="block font-bold text-gray-900 text-sm">Not Editable</span>
                     <span className="text-xs text-gray-500">You must reprint the code if you change the link.</span>
                   </div>
                 </li>
               </ul>
            </div>

            {/* Dynamic Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative opacity-90">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                   <ServerOff size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-[#1F1F1F]">Dynamic QR Code</h3>
               </div>
               <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                 Encodes a short redirect URL (e.g., bit.ly) that forwards to your destination. Requires a server to manage.
               </p>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-green-100 text-green-700 rounded-full"><Check size={12} strokeWidth={3} /></div>
                   <div>
                     <span className="block font-bold text-gray-900 text-sm">Editable</span>
                     <span className="text-xs text-gray-500">Change the destination URL without reprinting.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-green-100 text-green-700 rounded-full"><Check size={12} strokeWidth={3} /></div>
                   <div>
                     <span className="block font-bold text-gray-900 text-sm">Trackable</span>
                     <span className="text-xs text-gray-500">View scan statistics and analytics.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-red-100 text-red-700 rounded-full"><XIcon size={12} strokeWidth={3} /></div>
                   <div>
                     <span className="block font-bold text-gray-900 text-sm">Subscription Required</span>
                     <span className="text-xs text-gray-500">Often requires monthly fees.</span>
                   </div>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-0.5 p-1 bg-red-100 text-red-700 rounded-full"><XIcon size={12} strokeWidth={3} /></div>
                   <div>
                     <span className="block font-bold text-gray-900 text-sm">Privacy Risk</span>
                     <span className="text-xs text-gray-500">Data flows through a third-party server.</span>
                   </div>
                 </li>
               </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
             <div className="p-4 bg-white rounded-full shadow-sm text-[#0B57D0] shrink-0">
               <Shield size={32} />
             </div>
             <div>
               <h4 className="text-lg font-bold text-[#1F1F1F] mb-2">Why we only generate Static Codes</h4>
               <p className="text-sm text-gray-600 leading-relaxed">
                 We believe your data belongs to you. By generating static codes, we ensure that your QR codes work <strong>forever</strong> without relying on our servers to stay online. There is no risk of "link rot" if we ever shut down, and no risk of us tracking your users. It's the safest choice for long-term use.
               </p>
             </div>
          </div>

        </div>

        <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-[#1F1F1F] text-white font-medium rounded-xl hover:bg-black transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};