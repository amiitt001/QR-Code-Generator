import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

export interface AdvancedQRSettings {
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  cornerStyle: 'square' | 'rounded' | 'circle' | 'diamond';
  patternStyle: 'default' | 'dots' | 'rounded' | 'sharp';
  marginSize: number;
}

export const AdvancedSettingsPanel: React.FC<{
  settings: AdvancedQRSettings;
  onChange: (settings: AdvancedQRSettings) => void;
}> = ({ settings, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleErrorCorrectionChange = (level: 'L' | 'M' | 'Q' | 'H') => {
    onChange({ ...settings, errorCorrection: level });
  };

  const handleCornerStyleChange = (style: 'square' | 'rounded' | 'circle' | 'diamond') => {
    onChange({ ...settings, cornerStyle: style });
  };

  const handlePatternStyleChange = (style: 'default' | 'dots' | 'rounded' | 'sharp') => {
    onChange({ ...settings, patternStyle: style });
  };

  const handleMarginChange = (margin: number) => {
    onChange({ ...settings, marginSize: Math.max(0, Math.min(10, margin)) });
  };

  const errorCorrectionInfo = {
    L: '~7% correction capacity',
    M: '~15% correction capacity',
    Q: '~25% correction capacity',
    H: '~30% correction capacity (recommended)',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
        <ChevronDown
          size={20}
          className={`text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 p-6 space-y-6">
          {/* Error Correction Level */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm font-semibold text-gray-900">Error Correction Level</label>
              <div className="group relative">
                <Info size={16} className="text-gray-400 cursor-help" />
                <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-48 bg-gray-900 text-white text-xs rounded p-2 z-10">
                  Higher levels allow QR codes to be scanned even if partially damaged
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['L', 'M', 'Q', 'H'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleErrorCorrectionChange(level as 'L' | 'M' | 'Q' | 'H')}
                  className={`p-3 rounded-lg text-center transition-all ${
                    settings.errorCorrection === level
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={errorCorrectionInfo[level as keyof typeof errorCorrectionInfo]}
                >
                  <div className="font-bold text-sm">{level}</div>
                  <div className="text-xs opacity-75">
                    {level === 'L' && '7%'}
                    {level === 'M' && '15%'}
                    {level === 'Q' && '25%'}
                    {level === 'H' && '30%'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Corner Style */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">Corner Style</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'square', label: 'Square', icon: '◻' },
                { id: 'rounded', label: 'Rounded', icon: '⬜' },
                { id: 'circle', label: 'Circle', icon: '◯' },
                { id: 'diamond', label: 'Diamond', icon: '◇' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleCornerStyleChange(style.id as any)}
                  className={`p-3 rounded-lg transition-all text-center ${
                    settings.cornerStyle === style.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{style.icon}</div>
                  <div className="text-xs font-medium">{style.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern Style */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">Pattern Style</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'default', label: 'Default' },
                { id: 'dots', label: 'Dots' },
                { id: 'rounded', label: 'Rounded' },
                { id: 'sharp', label: 'Sharp' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => handlePatternStyleChange(style.id as any)}
                  className={`p-3 rounded-lg transition-all text-center ${
                    settings.patternStyle === style.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xs font-medium">{style.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Margin Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-900">Margin Size</label>
              <span className="text-sm font-medium text-blue-600">{settings.marginSize}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={settings.marginSize}
              onChange={(e) => handleMarginChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>None</span>
              <span>10px</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> Higher error correction levels create larger QR codes but work even when partially damaged.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
