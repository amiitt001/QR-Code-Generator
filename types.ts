export type QRMode = 'text' | 'url' | 'wifi' | 'vcard' | 'ai';

export interface QRSettings {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
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