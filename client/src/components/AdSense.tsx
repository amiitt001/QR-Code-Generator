import React from 'react';

interface AdSenseProps {
  className?: string;
  style?: React.CSSProperties;
  client?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layoutKey?: string;
}

export const AdSense: React.FC<AdSenseProps> = ({
  className,
  style,
  client = 'ca-pub-XXXXXXXXXXXXXXXX', // TODO: Replace with your actual Publisher ID
  slot = '1234567890', // TODO: Replace with default slot ID
  format = 'auto',
  layoutKey
}) => {
  // AdSense disabled - Replace placeholder client ID with real one to enable
  const isConfigured = client && !client.includes('XXXXXXXX');
  
  if (!isConfigured) {
    return null; // Don't render if not properly configured
  }

  return (
    <div className={`ad-container w-full overflow-hidden ${className || ''}`} aria-label="Advertisement">
       {/* Compliance Label */}
       <div className="text-[10px] text-gray-300 font-medium uppercase tracking-widest text-center mb-2 select-none">
          Advertisement
       </div>
       <div className="min-h-[100px] bg-gray-50/50 rounded-lg flex items-center justify-center">
          <ins className="adsbygoogle"
            style={{ display: 'block', width: '100%', ...style }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
            {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
          />
       </div>
    </div>
  );
};