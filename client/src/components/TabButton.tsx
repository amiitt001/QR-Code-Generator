import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabButtonProps {
  active: boolean;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isSpecial?: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({ active, label, icon: Icon, onClick, isSpecial }) => {
  if (isSpecial) {
    return (
      <button
        onClick={onClick}
        className={`relative flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold transition-all duration-300 rounded-full flex-shrink-0 ${
          active
            ? 'bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] text-white shadow-lg shadow-purple-500/20'
            : 'bg-white text-[#1F1F1F] hover:bg-gray-50 border border-gray-200'
        }`}
      >
        <Icon size={18} className={active ? 'text-white' : 'text-[#0B57D0]'} />
        <span className="relative z-10">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-200 rounded-full flex-shrink-0 ${
        active
          ? 'bg-[#1F1F1F] text-white shadow-md shadow-gray-200'
          : 'text-[#444746] hover:bg-white hover:text-[#1F1F1F] hover:shadow-sm'
      }`}
    >
      <Icon size={18} className={active ? 'text-white' : 'text-[#444746]'} />
      <span className="relative z-10">{label}</span>
    </button>
  );
};