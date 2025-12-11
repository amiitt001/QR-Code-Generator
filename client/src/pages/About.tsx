import React from 'react';
import { Shield, Zap, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-20 space-y-4 reveal-on-scroll">
        <h1 className="text-5xl font-medium text-[#1F1F1F] tracking-tight">About Us</h1>
        <p className="text-xl text-[#444746] max-w-2xl mx-auto leading-relaxed">
          Making advanced QR technology accessible, beautiful, and intelligent for everyone.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="text-center p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow reveal-on-scroll delay-100">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap size={28} />
          </div>
          <h3 className="font-bold text-xl mb-3 text-[#1F1F1F]">Fast & Simple</h3>
          <p className="text-[#444746] text-sm leading-relaxed">
            Instant high-quality generation. No sign-ups, no barriers.
          </p>
        </div>
        <div className="text-center p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow reveal-on-scroll delay-200">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield size={28} />
          </div>
          <h3 className="font-bold text-xl mb-3 text-[#1F1F1F]">Privacy First</h3>
          <p className="text-[#444746] text-sm leading-relaxed">
            Data sovereignty matters. All codes are generated locally or statelessly.
          </p>
        </div>
        <div className="text-center p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow reveal-on-scroll delay-300">
          <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart size={28} />
          </div>
          <h3 className="font-bold text-xl mb-3 text-[#1F1F1F]">AI Powered</h3>
          <p className="text-[#444746] text-sm leading-relaxed">
            Built with Google's Gemini 2.5 Flash to understand natural language inputs.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] reveal-on-scroll delay-200">
        <h2 className="text-2xl font-bold text-[#1F1F1F] mb-6">Our Technology</h2>
        <div className="space-y-6 text-[#444746] text-lg leading-relaxed">
          <p>
            Gemini QR Studio leverages the latest web technologies to deliver a tool that is not just functional, but delightful to use. By combining <strong>React</strong> for a responsive interface with <strong>Google's GenAI SDK</strong>, we've created a generator that understands intent.
          </p>
          <p>
            Unlike many "free" tools that lock features behind paywalls or use tracking links, our tool creates true, static QR codes. They belong to you, forever.
          </p>
        </div>
      </div>
    </div>
  );
};