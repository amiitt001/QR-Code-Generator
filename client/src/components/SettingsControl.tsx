import React from 'react';
import { Square, Circle, BoxSelect, Diamond } from 'lucide-react';
import { QRModuleShape } from '../types';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => (
  <div className="space-y-3">
    <label className="text-sm font-semibold text-[#444746] ml-1">{label}</label>
    <div className="flex items-center gap-3 p-2 border border-gray-100 rounded-2xl bg-[#F8FAFC] hover:bg-[#F0F4F9] transition-colors cursor-pointer group shadow-sm">
      <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm ring-2 ring-white shrink-0 group-hover:scale-105 transition-transform duration-300">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 border-0 cursor-pointer"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent border-none text-[#1F1F1F] text-sm font-mono focus:ring-0 p-0 uppercase"
      />
    </div>
  </div>
);

interface PaletteSelectorProps {
  palettes: { name: string; fg: string; bg: string }[];
  onSelect: (fg: string, bg: string) => void;
  currentFg: string;
  currentBg: string;
}

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({ palettes, onSelect, currentFg, currentBg }) => (
  <div className="space-y-4 w-full">
    <label className="text-sm font-semibold text-[#444746] ml-1">Quick Styles</label>
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {palettes.map((p) => {
        const isActive = currentFg === p.fg && currentBg === p.bg;
        return (
          <button
            key={p.name}
            onClick={() => onSelect(p.fg, p.bg)}
            className={`group relative flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-200 ${
              isActive ? 'bg-[#F0F4F9] ring-1 ring-[#0B57D0]/20' : 'hover:bg-gray-50'
            }`}
          >
            <div 
              className={`relative w-10 h-10 rounded-full border shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
                isActive ? 'ring-2 ring-[#0B57D0] ring-offset-2 border-transparent' : 'border-gray-200'
              }`}
              style={{ backgroundColor: p.bg }}
            >
               {/* Inner Dot representing Foreground */}
               <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: p.fg }} />
            </div>
            <span className={`text-[11px] font-medium transition-colors ${
              isActive ? 'text-[#0B57D0]' : 'text-[#444746]'
            }`}>
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ label, value, min, max, step = 1, onChange }) => (
  <div className="space-y-5">
    <div className="flex justify-between items-end px-1">
      <label className="text-sm font-semibold text-[#444746]">{label}</label>
      <span className="text-xs font-bold text-[#0B57D0] bg-[#D3E3FD]/30 border border-[#D3E3FD] px-3 py-1 rounded-full">
        {value}px
      </span>
    </div>
    <div className="relative h-2 bg-gray-100 rounded-full mx-1">
      <div 
        className="absolute h-full bg-[#0B57D0] rounded-full transition-all duration-150" 
        style={{ width: `${((value - min) / (max - min)) * 100}%` }} 
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div 
        className="absolute h-6 w-6 bg-white border border-gray-200 rounded-full shadow-md top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150 hover:scale-110"
        style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 12px)` }}
      >
        <div className="absolute inset-0 m-auto w-2 h-2 bg-[#0B57D0] rounded-full" />
      </div>
    </div>
  </div>
);

interface SelectControlProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}

export const SelectControl: React.FC<SelectControlProps> = ({ label, value, options, onChange }) => (
  <div className="space-y-3">
    <label className="text-sm font-semibold text-[#444746] ml-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-[#F8FAFC] border border-gray-100 text-[#1F1F1F] text-sm rounded-2xl pl-5 pr-10 py-4 focus:ring-4 focus:ring-[#0B57D0]/10 focus:border-[#0B57D0] focus:bg-white outline-none transition-all cursor-pointer shadow-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#444746]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);

interface ShapeSelectorProps {
  value: QRModuleShape;
  onChange: (val: QRModuleShape) => void;
}

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({ value, onChange }) => {
  const shapes: { id: QRModuleShape; label: string; icon: React.ElementType }[] = [
    { id: 'square', label: 'Square', icon: Square },
    { id: 'circle', label: 'Dots', icon: Circle },
    { id: 'rounded', label: 'Round', icon: BoxSelect },
    { id: 'diamond', label: 'Diamond', icon: Diamond },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-[#444746] ml-1">Module Shape</label>
      <div className="grid grid-cols-4 gap-2">
        {shapes.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
              value === s.id
                ? 'bg-[#EBF2FA] border-[#0B57D0] text-[#0B57D0] shadow-sm'
                : 'bg-[#F8FAFC] border-gray-100 text-[#444746] hover:bg-white hover:border-gray-200 hover:shadow-sm'
            }`}
            title={s.label}
          >
            <s.icon size={20} strokeWidth={2} className={value === s.id ? 'fill-current opacity-20' : ''} />
          </button>
        ))}
      </div>
    </div>
  );
};
