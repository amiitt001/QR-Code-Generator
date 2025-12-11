import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto z-10 relative">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="col-span-1 md:col-span-4">
            <h3 className="text-xl font-bold text-[#1F1F1F] mb-6">Gemini QR</h3>
            <p className="text-[#444746] text-sm leading-relaxed max-w-xs">
              Next-generation QR code generation powered by Google's Gemini AI. Designed for performance, privacy, and precision.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <h4 className="text-xs font-bold text-[#444746] uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('home')} className="text-sm text-[#444746] hover:text-[#0B57D0] transition-colors">
                  Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-sm text-[#444746] hover:text-[#0B57D0] transition-colors">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-sm text-[#444746] hover:text-[#0B57D0] transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xs font-bold text-[#444746] uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-sm text-[#444746] hover:text-[#0B57D0] transition-colors">
                  Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-sm text-[#444746] hover:text-[#0B57D0] transition-colors">
                  Terms
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[#9CA3AF]">
            © {new Date().getFullYear()} Gemini QR Studio. Open source and free forever.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
               <span className="sr-only">Twitter</span>
               {/* Icon placeholder */}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};