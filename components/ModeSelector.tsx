import React from 'react';
import { 
  Link, 
  Type, 
  Mail, 
  Phone, 
  MessageSquare, 
  Contact2, 
  MessageCircle, 
  Wifi, 
  FileText, 
  AppWindow, 
  Image, 
  Video, 
  Share2, 
  Calendar, 
  Barcode, 
  Sparkles 
} from 'lucide-react';
import { QRMode } from '../types';

interface ModeSelectorProps {
  active: QRMode;
  onSelect: (mode: QRMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ active, onSelect }) => {
  const modes: { id: QRMode; label: string; icon: React.ElementType }[] = [
    { id: 'url', label: 'Link', icon: Link },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'email', label: 'E-mail', icon: Mail },
    { id: 'phone', label: 'Call', icon: Phone },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'vcard', label: 'V-card', icon: Contact2 },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'wifi', label: 'WI-FI', icon: Wifi },
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'app', label: 'App', icon: AppWindow },
    { id: 'image', label: 'Images', icon: Image },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'event', label: 'Event', icon: Calendar },
    { id: 'barcode', label: '2D Barcode', icon: Barcode },
    { id: 'ai', label: 'Magic AI', icon: Sparkles },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 p-2">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left group ${
            active === mode.id
              ? 'bg-[#EBF2FA] border-[#0B57D0] shadow-sm ring-1 ring-[#0B57D0]/20'
              : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
          }`}
        >
          <div className={`p-2.5 rounded-lg transition-colors ${
            active === mode.id ? 'bg-white text-[#0B57D0]' : 'bg-[#F0F4F9] text-[#444746] group-hover:text-[#1F1F1F]'
          }`}>
            <mode.icon size={20} strokeWidth={2} />
          </div>
          <span className={`text-sm font-semibold ${
            active === mode.id ? 'text-[#0B57D0]' : 'text-[#444746]'
          }`}>
            {mode.label}
          </span>
        </button>
      ))}
    </div>
  );
};