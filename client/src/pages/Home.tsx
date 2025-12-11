import React from 'react';
import { QrCode, FileText, TrendingUp, Zap, Shield, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: QrCode,
      title: 'QR Code Generator',
      description: 'Create custom QR codes with AI assistance, advanced styling, and multiple formats.',
      color: 'from-blue-500 to-indigo-600',
      page: 'qr'
    },
    {
      icon: FileText,
      title: 'PDF Converter',
      description: 'Convert, merge, split, compress and manipulate PDFs with powerful tools.',
      color: 'from-purple-500 to-pink-600',
      page: 'pdf-converter'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track your usage, view statistics, and optimize your workflow.',
      color: 'from-green-500 to-teal-600',
      page: 'dashboard'
    }
  ];

  const highlights = [
    {
      icon: Zap,
      title: '100% Client-Side',
      description: 'All processing happens in your browser. No server uploads, instant results.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data never leaves your device. Complete privacy and security.'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Smart QR generation with Google Gemini AI for intelligent formatting.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center space-y-8 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI • 100% Client-Side</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-[#1F1F1F]">Create, Convert</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                & Analyze
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your all-in-one toolkit for QR codes and PDF operations. 
              Fast, secure, and completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => onNavigate('qr')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Generate QR Code
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => onNavigate('pdf-converter')}
                className="group px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold text-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 flex items-center gap-2"
              >
                Convert PDF
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group reveal-on-scroll cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onNavigate(feature.page)}
              >
                <div className="relative h-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-2">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#1F1F1F] mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Get Started</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1F1F1F] mb-4">
              Why Choose Our Tools?
            </h2>
            <p className="text-xl text-gray-600">
              Built with modern web technologies for the best experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div
                key={highlight.title}
                className="text-center reveal-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
                  <highlight.icon className="w-10 h-10 text-blue-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-[#1F1F1F] mb-3">
                  {highlight.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="reveal-on-scroll">
              <div className="text-5xl font-bold mb-2">10+</div>
              <div className="text-blue-100 text-lg">QR Code Modes</div>
            </div>
            <div className="reveal-on-scroll" style={{ animationDelay: '100ms' }}>
              <div className="text-5xl font-bold mb-2">6+</div>
              <div className="text-blue-100 text-lg">PDF Operations</div>
            </div>
            <div className="reveal-on-scroll" style={{ animationDelay: '200ms' }}>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-blue-100 text-lg">Client-Side</div>
            </div>
            <div className="reveal-on-scroll" style={{ animationDelay: '300ms' }}>
              <div className="text-5xl font-bold mb-2">Free</div>
              <div className="text-blue-100 text-lg">Forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-4xl font-bold text-[#1F1F1F] mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose your tool and start creating amazing content
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('qr')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start with QR Codes
            </button>
            
            <button
              onClick={() => onNavigate('pdf-converter')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Try PDF Converter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
