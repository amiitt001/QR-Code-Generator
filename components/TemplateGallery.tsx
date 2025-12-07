import React from 'react';
import { Instagram, Linkedin, Youtube, Wifi, Sparkles, UserCircle2, MapPin, Globe } from 'lucide-react';
import { QRMode } from '../types';

export interface QRTemplate {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  mode: QRMode;
  fgColor: string;
  bgColor: string;
  placeholder?: string;
  aiPrompt?: string; // For AI mode pre-fill
  styleClass: string; // Tailwind class for the card visual
}

export const TEMPLATES: QRTemplate[] = [
  {
    id: 'insta',
    name: 'Instagram',
    category: 'Social',
    icon: Instagram,
    mode: 'url',
    fgColor: '#E1306C',
    bgColor: '#FFF0F5',
    placeholder: 'https://instagram.com/your_username',
    styleClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Professional',
    icon: Linkedin,
    mode: 'url',
    fgColor: '#0077B5',
    bgColor: '#F0F7FB',
    placeholder: 'https://linkedin.com/in/your_profile',
    styleClass: 'bg-[#0077B5] text-white'
  },
  {
    id: 'magic_card',
    name: 'Magic Card',
    category: 'AI',
    icon: Sparkles,
    mode: 'ai',
    fgColor: '#7C3AED',
    bgColor: '#F5F3FF',
    aiPrompt: 'Create a professional vCard for [Name], Role: [Job Title], Email: [Email], Phone: [Number]',
    styleClass: 'bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] text-white'
  },
  {
    id: 'wifi_guest',
    name: 'Guest Wi-Fi',
    category: 'Utility',
    icon: Wifi,
    mode: 'wifi',
    fgColor: '#1F1F1F',
    bgColor: '#FFFFFF',
    styleClass: 'bg-[#1F1F1F] text-white'
  },
  {
    id: 'youtube',
    name: 'Channel',
    category: 'Social',
    icon: Youtube,
    mode: 'url',
    fgColor: '#FF0000',
    bgColor: '#FFFAFA',
    placeholder: 'https://youtube.com/@your_channel',
    styleClass: 'bg-[#FF0000] text-white'
  },
  {
    id: 'location',
    name: 'Location',
    category: 'Maps',
    icon: MapPin,
    mode: 'url',
    fgColor: '#0F9D58',
    bgColor: '#F0FDF4',
    placeholder: 'https://maps.google.com/?q=...',
    styleClass: 'bg-[#0F9D58] text-white'
  }
];

interface TemplateGalleryProps {
  onSelect: (template: QRTemplate) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
         <h2 className="text-sm font-bold text-[#444746] uppercase tracking-widest">Start with a Design</h2>
         <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Popular</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="group relative flex flex-col items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 text-left overflow-hidden"
          >
            {/* Icon Circle */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm mb-1 transition-transform group-hover:scale-110 ${t.styleClass}`}>
              <t.icon size={22} strokeWidth={2} />
            </div>
            
            <div className="flex flex-col items-center w-full">
              <span className="text-xs font-bold text-[#1F1F1F] group-hover:text-[#0B57D0] transition-colors">
                {t.name}
              </span>
              <span className="text-[10px] text-gray-400">
                {t.category}
              </span>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 border-2 border-[#0B57D0] opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
};