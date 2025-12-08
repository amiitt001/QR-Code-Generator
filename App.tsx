import React, { useState, useEffect } from 'react';
import { QRGenerator } from './components/QRGenerator';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { QrCode, Sparkles, Menu, X } from 'lucide-react';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Initialize Scroll Animations
  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      // For parallax
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <QRGenerator />;
      case 'privacy': return <PrivacyPolicy />;
      case 'terms': return <Terms />;
      case 'about': return <About />;
      case 'contact': return <Contact />;
      default: return <QRGenerator />;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    scrollToTop();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1F1F1F] selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden">
      {/* Ambient Background with Soft Parallax */}
      <div className="fixed inset-0 -z-10 bg-[#F0F4F9]">
        <div 
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse duration-[10000ms]" 
          style={{ transform: `translate3d(-50%, calc(-50% + ${scrollY * 0.1}px), 0)` }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 animate-pulse duration-[10000ms] delay-1000"
          style={{ transform: `translate3d(50%, calc(50% - ${scrollY * 0.05}px), 0)` }}
        />
      </div>

      {/* Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled || isMobileMenuOpen 
            ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-2' 
            : 'bg-transparent border-transparent py-4'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex justify-between h-14 items-center">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer select-none z-50 group" 
              onClick={() => handleNavigate('home')}
            >
              <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                <QrCode className="text-[#0B57D0]" strokeWidth={2} size={20}/>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#1F1F1F]">
                QR Studio
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-gray-100/50 reveal-on-scroll delay-100">
               <nav className="flex gap-1">
                 {['home', 'about', 'contact'].map((page) => (
                   <button 
                    key={page}
                    onClick={() => handleNavigate(page)} 
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      currentPage === page 
                        ? 'bg-[#1F1F1F] text-white shadow-md' 
                        : 'text-[#444746] hover:bg-white hover:shadow-sm'
                    }`}
                   >
                     {page.charAt(0).toUpperCase() + page.slice(1)}
                   </button>
                 ))}
               </nav>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden z-50 p-2 text-[#444746]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <div 
          className={`fixed inset-0 bg-[#F0F4F9] z-40 transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:hidden flex flex-col pt-24 px-6 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="flex flex-col gap-4">
             {['home', 'about', 'contact', 'privacy', 'terms'].map((page, idx) => (
               <button 
                key={page}
                onClick={() => handleNavigate(page)} 
                className={`text-2xl font-medium text-left py-4 border-b border-gray-200 reveal-on-scroll ${
                  currentPage === page ? 'text-[#0B57D0]' : 'text-[#1F1F1F]'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
               >
                 {page.charAt(0).toUpperCase() + page.slice(1)}
               </button>
             ))}
          </nav>
          
          <div className="mt-auto mb-8 reveal-on-scroll delay-300">
             <a 
                href="https://ai.google.dev" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 text-base font-medium p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <Sparkles size={18} className="text-[#0B57D0]" />
                <span className="bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent">
                  Powered by Google Gemini
                </span>
              </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 sm:px-8 py-8 lg:py-12 z-0">
        {renderPage()}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}