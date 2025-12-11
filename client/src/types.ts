
export type QRMode = 
  | 'url' 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'vcard' 
  | 'whatsapp' 
  | 'wifi' 
  | 'pdf' 
  | 'app' 
  | 'image' 
  | 'video' 
  | 'social' 
  | 'event' 
  | 'barcode' 
  | 'ai';

export type QRModuleShape = 'square' | 'circle' | 'rounded' | 'diamond';

export interface QRSettings {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  style: QRModuleShape;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

export interface WifiSettings {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardSettings {
  firstName: string;
  lastName: string;
  organization: string;
  position: string;
  phoneWork: string;
  phoneMobile: string;
  email: string;
  website: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}