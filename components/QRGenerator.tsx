import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from './QRCodeCanvas';
import { ColorPicker, RangeSlider, SelectControl, PaletteSelector, ShapeSelector } from './SettingsControl';
import { TemplateGallery, QRTemplate } from './TemplateGallery';
import { ModeSelector } from './ModeSelector'; 
import { FileDropZone } from './FileDropZone'; 
import { SEOContent } from './SEOContent';
import { VerificationModal } from './VerificationModal';
import { EmbedModal } from './EmbedModal';
import { QRScannerModal } from './QRScannerModal'; 
import { StaticVsDynamicModal } from './StaticVsDynamicModal'; 
import { AdSense } from './AdSense';
import { SecurityService } from '../utils/security';
import { generateSmartQRData } from '../services/geminiService';
import { QRSettings, QRMode, GenerationStatus } from '../types';
import {
  Download,
  Copy,
  CheckCircle2,
  RefreshCw,
  Globe,
  AlignLeft,
  Lock,
  Eye,
  EyeOff,
  Wand2,
  Share2,
  AlertTriangle,
  Code,
  Twitter,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  Contact2,
  Wifi,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  ScanLine,
  Info
} from 'lucide-react';

const DEFAULT_SETTINGS: QRSettings = {
  value: 'https://google.com',
  size: 256,
  fgColor: '#1F1F1F',
  bgColor: '#ffffff',
  level: 'M',
  includeMargin: true,
  style: 'square',
};

const PRESET_PALETTES = [
  { name: 'Classic', fg: '#1F1F1F', bg: '#FFFFFF' },
  { name: 'Gemini', fg: '#0B57D0', bg: '#F0F4F9' },
  { name: 'Dark', fg: '#FFFFFF', bg: '#1F1F1F' },
  { name: 'Forest', fg: '#14532D', bg: '#F0FDF4' },
  { name: 'Sunset', fg: '#9A3412', bg: '#FFF7ED' },
  { name: 'Berry', fg: '#831843', bg: '#FDF2F8' },
];

export const QRGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QRMode>('url');
  const [settings, setSettings] = useState<QRSettings>(DEFAULT_SETTINGS);
  
  // Input States for various modes
  const [inputText, setInputText] = useState('https://google.com');
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Email
  const [emailState, setEmailState] = useState({ email: '', subject: '', body: '' });
  // Phone & SMS & WhatsApp
  const [phoneState, setPhoneState] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  // VCard
  const [vcardState, setVcardState] = useState({ firstName: '', lastName: '', phone: '', email: '', org: '', url: '' });
  // Event
  const [eventState, setEventState] = useState({ title: '', location: '', start: '', end: '', description: '' });
  // Wifi
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [showWifiPass, setShowWifiPass] = useState(false);
  
  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState('');

  // States
  const [aiStatus, setAiStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [aiSummary, setAiSummary] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isStaticInfoOpen, setIsStaticInfoOpen] = useState(false);
  const [embedDataUrl, setEmbedDataUrl] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Logic to Update QR Value based on Active Tab and Inputs ---
  useEffect(() => {
    let newVal = '';

    switch (activeTab) {
      case 'url':
      case 'pdf':
      case 'app':
      case 'image':
      case 'video':
      case 'social':
      case 'barcode': // Treated as text
      case 'text':
        newVal = inputText;
        break;
      
      case 'email':
        newVal = `mailto:${emailState.email}?subject=${encodeURIComponent(emailState.subject)}&body=${encodeURIComponent(emailState.body)}`;
        break;
        
      case 'phone':
        newVal = `tel:${phoneState}`;
        break;
        
      case 'sms':
        newVal = `SMSTO:${phoneState}:${smsMessage}`;
        break;
        
      case 'whatsapp':
        // WhatsApp URL format
        newVal = `https://wa.me/${phoneState.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(smsMessage)}`;
        break;

      case 'wifi':
        const ssid = wifiSsid.replace(/([\\;,:"])/g, '\\$1');
        const pass = wifiPass.replace(/([\\;,:"])/g, '\\$1');
        newVal = `WIFI:T:${wifiEncryption};S:${ssid};P:${pass};${wifiHidden ? 'H:true;' : ''};`;
        break;

      case 'vcard':
        newVal = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardState.lastName};${vcardState.firstName};;;\nFN:${vcardState.firstName} ${vcardState.lastName}\nORG:${vcardState.org}\nTEL;TYPE=CELL:${vcardState.phone}\nEMAIL:${vcardState.email}\nURL:${vcardState.url}\nEND:VCARD`;
        break;

      case 'event':
        // Simple VEVENT formatting
        const formatDate = (d: string) => d ? d.replace(/[-:]/g, '') + '00' : '';
        newVal = `BEGIN:VEVENT\nSUMMARY:${eventState.title}\nLOCATION:${eventState.location}\nDTSTART:${formatDate(eventState.start)}\nDTEND:${formatDate(eventState.end)}\nDESCRIPTION:${eventState.description}\nEND:VEVENT`;
        break;

      case 'ai':
        // AI sets settings.value directly via executeAiGeneration
        return; 
        
      default:
        newVal = inputText;
    }

    setSettings(prev => ({ ...prev, value: newVal }));

  }, [
    activeTab, 
    inputText, 
    emailState, 
    phoneState, 
    smsMessage, 
    wifiSsid, 
    wifiPass, 
    wifiEncryption, 
    wifiHidden,
    vcardState,
    eventState
  ]);

  const handleApplyTemplate = (template: QRTemplate) => {
    setActiveTab(template.mode);
    setSettings(prev => ({
      ...prev,
      fgColor: template.fgColor,
      bgColor: template.bgColor,
      style: 'square' // Reset style to square for compatibility with logo usually, but users can change it
    }));

    if (template.mode === 'url' && template.placeholder) {
      setInputText(template.placeholder);
    } else if (template.mode === 'ai' && template.aiPrompt) {
      setAiPrompt(template.aiPrompt);
    }
    
    // Scroll to input
    const inputArea = document.getElementById('input-card');
    if (inputArea) inputArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleScanResult = (decodedText: string) => {
    // 1. Try to detect Wi-Fi
    if (decodedText.startsWith("WIFI:")) {
      setActiveTab('wifi');
      const ssid = decodedText.match(/S:([^;]+)/)?.[1] || '';
      const pass = decodedText.match(/P:([^;]+)/)?.[1] || '';
      const type = decodedText.match(/T:([^;]+)/)?.[1] || 'WPA';
      const hidden = decodedText.includes("H:true");
      setWifiSsid(ssid.replace(/\\([\\;,:"])/g, '$1')); // unescape
      setWifiPass(pass.replace(/\\([\\;,:"])/g, '$1'));
      setWifiEncryption(type as any);
      setWifiHidden(hidden);
      return;
    }

    // 2. Try to detect vCard
    if (decodedText.startsWith("BEGIN:VCARD")) {
      setActiveTab('vcard');
      const fn = decodedText.match(/FN:([^\n]+)/)?.[1] || '';
      const n = decodedText.match(/N:([^\n]+)/)?.[1] || '';
      const [last, first] = n.split(';');
      const tel = decodedText.match(/TEL[^:]*:([^\n]+)/)?.[1] || '';
      const email = decodedText.match(/EMAIL[^:]*:([^\n]+)/)?.[1] || '';
      const org = decodedText.match(/ORG:([^\n]+)/)?.[1] || '';
      const url = decodedText.match(/URL:([^\n]+)/)?.[1] || '';
      
      setVcardState({
        firstName: first || fn.split(' ')[0] || '',
        lastName: last || fn.split(' ').slice(1).join(' ') || '',
        phone: tel,
        email: email,
        org: org,
        url: url
      });
      return;
    }

    // 3. Try to detect Mailto
    if (decodedText.startsWith("mailto:")) {
      setActiveTab('email');
      const email = decodedText.match(/mailto:([^?]+)/)?.[1] || '';
      const subject = decodedText.match(/subject=([^&]+)/)?.[1] || '';
      const body = decodedText.match(/body=([^&]+)/)?.[1] || '';
      setEmailState({
        email: decodeURIComponent(email),
        subject: decodeURIComponent(subject),
        body: decodeURIComponent(body)
      });
      return;
    }

    // 4. Try to detect SMS
    if (decodedText.startsWith("SMSTO:") || decodedText.startsWith("sms:")) {
      setActiveTab('sms');
      const parts = decodedText.replace(/^(SMSTO:|sms:)/, '').split(':');
      setPhoneState(parts[0]);
      setSmsMessage(parts[1] || '');
      return;
    }

    // 5. Try to detect Phone
    if (decodedText.startsWith("tel:")) {
      setActiveTab('phone');
      setPhoneState(decodedText.replace("tel:", ""));
      return;
    }

    // 6. Default to URL/Text
    if (decodedText.match(/^https?:\/\//i)) {
      setActiveTab('url');
      setInputText(decodedText);
    } else {
      setActiveTab('text');
      setInputText(decodedText);
    }
    
    // Scroll to input
    const inputArea = document.getElementById('input-card');
    if (inputArea) inputArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    }
  };

  const handleEmbed = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setEmbedDataUrl(canvas.toDataURL("image/png"));
      setIsEmbedOpen(true);
    }
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "qrcode.png", { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'QR Code', text: 'Generated with Gemini QR Studio' });
        } catch (error) {}
      } else {
        try {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          alert("Image copied to clipboard!");
        } catch (err) {
          alert("Share not supported, please download.");
        }
      }
    }, 'image/png');
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const qrValue = settings.value;
    const isUrl = qrValue.match(/^https?:\/\//i);
    const linkToShare = isUrl ? qrValue : window.location.href;
    const text = "Check out this QR Code!";
    let url = '';
    switch (platform) {
      case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(linkToShare)}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`; break;
      case 'whatsapp': url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + linkToShare)}`; break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleFileUpload = (file: File) => {
    setUploadedFileName(file.name);
    const mockUrl = `https://your-domain.com/files/${file.name.replace(/\s+/g, '-')}`;
    setInputText(mockUrl);
  };

  const initiateAiGeneration = () => {
    if (!aiPrompt.trim()) return;
    setErrorMessage('');
    const limitCheck = SecurityService.checkRateLimit();
    if (!limitCheck.allowed) {
      setErrorMessage(limitCheck.error || 'Request blocked.');
      return;
    }
    setIsVerificationOpen(true);
  };

  const executeAiGeneration = async () => {
    setIsVerificationOpen(false);
    setAiStatus(GenerationStatus.LOADING);
    setAiSummary('');
    setErrorMessage('');
    try {
      const result = await generateSmartQRData(aiPrompt);
      setSettings(prev => ({ ...prev, value: result.data }));
      setAiSummary(result.summary);
      setAiStatus(GenerationStatus.SUCCESS);
      SecurityService.recordRequest();
    } catch (e) {
      setAiStatus(GenerationStatus.ERROR);
      setErrorMessage("Failed to generate.");
    }
  };

  const handleCopyValue = () => navigator.clipboard.writeText(settings.value);

  // --- Render Helpers ---
  const renderInput = () => {
    switch(activeTab) {
      case 'url':
      case 'app':
      case 'social':
        return (
          <div>
            <label className="block text-sm font-semibold text-[#444746] mb-3 ml-1">
              {activeTab === 'url' ? 'Website URL' : 
               activeTab === 'app' ? 'App Store / Play Store Link' :
               activeTab === 'social' ? 'Social Profile Link' : 'URL'}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-[#444746]" />
              </div>
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-[#1F1F1F] outline-none focus:ring-4 focus:ring-[#0B57D0]/10 focus:border-[#0B57D0]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          </div>
        );
      case 'pdf':
      case 'image':
      case 'video':
        const fileConfig = {
          pdf: { accept: '.pdf', label: 'PDF Document', icon: FileText },
          image: { accept: 'image/*', label: 'Image', icon: ImageIcon },
          video: { accept: 'video/*', label: 'Video', icon: VideoIcon }
        }[activeTab];
        return (
           <div className="space-y-6">
              <FileDropZone accept={fileConfig.accept} label={fileConfig.label} onFileSelect={handleFileUpload} />
              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">Or enter link manually</span></div></div>
              <div><label className="block text-sm font-semibold text-[#444746] mb-3 ml-1">Link to {fileConfig.label}</label><div className="relative group"><div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><Globe className="h-5 w-5 text-[#444746]" /></div><input type="url" placeholder={`https://example.com/my-file.${activeTab === 'pdf' ? 'pdf' : activeTab === 'video' ? 'mp4' : 'jpg'}`} className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-[#1F1F1F] outline-none focus:ring-4 focus:ring-[#0B57D0]/10 focus:border-[#0B57D0]" value={inputText} onChange={(e) => setInputText(e.target.value)} /></div>{uploadedFileName && (<p className="mt-2 text-xs text-green-600 flex items-center gap-1"><CheckCircle2 size={12} />Simulating link for uploaded file: <strong>{uploadedFileName}</strong></p>)}</div>
           </div>
        );
      case 'text':
      case 'barcode':
        return (
          <div><label className="block text-sm font-semibold text-[#444746] mb-3 ml-1">Content</label><div className="relative group"><div className="absolute top-5 left-5 flex items-start pointer-events-none"><AlignLeft className="h-5 w-5 text-[#444746]" /></div><textarea rows={5} placeholder="Type your text here..." className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-[#1F1F1F] outline-none focus:ring-4 focus:ring-[#0B57D0]/10 focus:border-[#0B57D0]" value={inputText} onChange={(e) => setInputText(e.target.value)} /></div></div>
        );
      case 'email':
        return (
          <div className="space-y-4"><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Email Address</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-gray-400"/></div><input type="email" placeholder="recipient@example.com" value={emailState.email} onChange={e => setEmailState({...emailState, email: e.target.value})} className="w-full pl-10 p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Subject</label><input type="text" placeholder="Hello..." value={emailState.subject} onChange={e => setEmailState({...emailState, subject: e.target.value})} className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Body</label><textarea rows={3} placeholder="Message content..." value={emailState.body} onChange={e => setEmailState({...emailState, body: e.target.value})} className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div>
        );
      case 'phone':
        return (
           <div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Phone Number</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-gray-400"/></div><input type="tel" placeholder="+1 234 567 8900" value={phoneState} onChange={e => setPhoneState(e.target.value)} className="w-full pl-10 p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div>
        );
      case 'sms':
      case 'whatsapp':
        return (
          <div className="space-y-4"><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">{activeTab === 'whatsapp' ? 'WhatsApp Number' : 'Phone Number'}</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{activeTab === 'whatsapp' ? <MessageCircle size={18} className="text-gray-400"/> : <Phone size={18} className="text-gray-400"/>}</div><input type="tel" placeholder="+1 234 567 8900" value={phoneState} onChange={e => setPhoneState(e.target.value)} className="w-full pl-10 p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Message</label><textarea rows={3} placeholder="I'm interested in..." value={smsMessage} onChange={e => setSmsMessage(e.target.value)} className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div>
        );
      case 'vcard':
        return (
          <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">First Name</label><input type="text" placeholder="John" value={vcardState.firstName} onChange={e => setVcardState({...vcardState, firstName: e.target.value})} className="w-full p-3 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Last Name</label><input type="text" placeholder="Doe" value={vcardState.lastName} onChange={e => setVcardState({...vcardState, lastName: e.target.value})} className="w-full p-3 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Mobile Phone</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-gray-400"/></div><input type="tel" value={vcardState.phone} onChange={e => setVcardState({...vcardState, phone: e.target.value})} className="w-full pl-10 p-3 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Email</label><input type="email" value={vcardState.email} onChange={e => setVcardState({...vcardState, email: e.target.value})} className="w-full p-3 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Website</label><input type="url" value={vcardState.url} onChange={e => setVcardState({...vcardState, url: e.target.value})} className="w-full p-3 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Organization</label><input type="text" value={vcardState.org} onChange={e => setVcardState({...vcardState, org: e.target.value})} className="w-full p-3 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div>
        );
      case 'event':
        return (
          <div className="space-y-4"><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Event Title</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Calendar size={18} className="text-gray-400"/></div><input type="text" placeholder="Birthday Party" value={eventState.title} onChange={e => setEventState({...eventState, title: e.target.value})} className="w-full pl-10 p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Location</label><input type="text" placeholder="123 Main St" value={eventState.location} onChange={e => setEventState({...eventState, location: e.target.value})} className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Start</label><input type="datetime-local" value={eventState.start} onChange={e => setEventState({...eventState, start: e.target.value})} className="w-full p-3 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">End</label><input type="datetime-local" value={eventState.end} onChange={e => setEventState({...eventState, end: e.target.value})} className="w-full p-3 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div><div><label className="block text-sm font-semibold text-[#444746] mb-2 ml-1">Description</label><textarea rows={2} value={eventState.description} onChange={e => setEventState({...eventState, description: e.target.value})} className="w-full p-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl outline-none focus:border-[#0B57D0]" /></div></div>
        );
      case 'wifi':
        return (
          <div className="space-y-6"><div><label className="block text-sm font-semibold text-[#444746] mb-3 ml-1">Network Name (SSID)</label><div className="relative group"><div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><Wifi className="h-5 w-5 text-[#444746]" /></div><input type="text" placeholder="e.g. MyHomeNetwork" className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-[#1F1F1F] outline-none focus:border-[#0B57D0]" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-semibold text-[#444746] mb-3 ml-1">Password</label><div className="relative group"><div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-[#444746]" /></div><input type={showWifiPass ? "text" : "password"} placeholder="Network Password" className="w-full pl-14 pr-12 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl text-[#1F1F1F] outline-none focus:border-[#0B57D0]" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} /><button type="button" onClick={() => setShowWifiPass(!showWifiPass)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#444746] cursor-pointer">{showWifiPass ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></div><div><SelectControl label="Security" value={wifiEncryption} options={[{ label: 'WPA/WPA2', value: 'WPA' }, { label: 'WEP', value: 'WEP' }, { label: 'None', value: 'nopass' }]} onChange={(v) => setWifiEncryption(v)} /></div></div><div className="flex items-center pt-2"><label className="relative flex items-center gap-3 cursor-pointer group p-3 rounded-2xl hover:bg-[#F0F4F9] transition-colors select-none"><input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} className="peer appearance-none h-5 w-5 border-2 border-[#444746] rounded-md checked:bg-[#0B57D0] checked:border-[#0B57D0] transition-all cursor-pointer" /><CheckCircle2 size={16} className="absolute left-[14px] top-[14px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" /><span className="text-sm font-medium text-[#444746]">Hidden Network</span></label></div></div>
        );
      case 'ai':
        return (
          <div className="space-y-6"><div className="relative overflow-hidden rounded-[2rem] bg-[#1F1F1F] p-8 text-white shadow-xl shadow-gray-200/50 group"><div className="absolute inset-0 bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div><div className="relative flex items-start gap-5"><div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner"><Wand2 size={24} className="text-[#D3E3FD]" /></div><div className="space-y-2"><h3 className="font-medium text-xl">AI Assistant</h3><p className="text-[#E3E3E3] text-sm leading-relaxed max-w-md">Describe your needs naturally. We'll handle the formatting.</p></div></div></div><div className="space-y-3"><div className="relative"><textarea rows={3} placeholder="e.g. 'Wi-Fi for MyCafe password coffee123' or 'Contact card for Jane Doe'" className="w-full p-6 bg-[#F8FAFC] border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-[#0B57D0]/10 focus:border-[#0B57D0] outline-none resize-none text-lg text-[#1F1F1F]" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { initiateAiGeneration(); } }} /></div>{errorMessage && (<div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 animate-pulse"><AlertTriangle size={16} />{errorMessage}</div>)}</div><div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-2">{aiStatus === GenerationStatus.SUCCESS && (<div className="flex-1 flex items-center gap-3 text-sm text-[#0F5C2E] bg-[#C4EED0]/30 px-4 py-3 rounded-2xl border border-[#C4EED0] animate-in fade-in"><CheckCircle2 size={18} className="text-[#0F5C2E]" /><span className="line-clamp-1 font-medium">{aiSummary || "Generated successfully!"}</span></div>)}<button onClick={initiateAiGeneration} disabled={aiStatus === GenerationStatus.LOADING || !aiPrompt.trim()} className="w-full sm:w-auto bg-gradient-to-r from-[#1F1F1F] to-[#444746] hover:to-black text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 active:scale-95 hover:-translate-y-0.5">{aiStatus === GenerationStatus.LOADING ? <><RefreshCw className="animate-spin" size={20} />Thinking...</> : <><Sparkles size={20} />Generate</>}</button></div></div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <VerificationModal isOpen={isVerificationOpen} onVerify={executeAiGeneration} onCancel={() => setIsVerificationOpen(false)} />
      <EmbedModal isOpen={isEmbedOpen} onClose={() => setIsEmbedOpen(false)} dataUrl={embedDataUrl} />
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleScanResult} />
      <StaticVsDynamicModal isOpen={isStaticInfoOpen} onClose={() => setIsStaticInfoOpen(false)} />

      <div className="text-center mb-16 space-y-4 reveal-on-scroll">
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-[#1F1F1F]">
          Create with <span className="bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent">Precision</span>
        </h1>
        <p className="text-lg text-[#444746] max-w-2xl mx-auto leading-relaxed">
          Generate smart, beautiful QR codes instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-24">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-7 space-y-8 reveal-on-scroll delay-100">
          <div id="input-card" className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
            <div className="bg-[#F8FAFC] border-b border-gray-100 relative">
               <ModeSelector active={activeTab} onSelect={setActiveTab} />
               <div className="absolute top-2 right-2">
                 <button onClick={() => setIsScannerOpen(true)} className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-[#444746] hover:text-[#0B57D0] hover:border-[#0B57D0]/30 transition-all flex items-center gap-2 font-semibold text-xs group z-20" title="Scan existing QR Code">
                   <ScanLine size={18} className="group-hover:scale-110 transition-transform" />
                   <span className="hidden sm:inline">Scan QR</span>
                 </button>
               </div>
            </div>
            <div className="p-8">
              <div className="animate-in fade-in zoom-in-95 duration-300">
                {renderInput()}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 reveal-on-scroll delay-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-[#1F1F1F] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D3E3FD]/50 flex items-center justify-center text-[#0B57D0]">
                  <Eye size={20} />
                </div>
                Customization
              </h2>
              <button 
                onClick={() => setIsStaticInfoOpen(true)}
                className="text-xs font-semibold text-[#0B57D0] bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <Info size={14} />
                Static vs Dynamic?
              </button>
            </div>
            
            <div className="space-y-8">
              <PaletteSelector 
                palettes={PRESET_PALETTES}
                currentFg={settings.fgColor}
                currentBg={settings.bgColor}
                onSelect={(fg, bg) => setSettings(prev => ({ ...prev, fgColor: fg, bgColor: bg }))}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <ColorPicker label="Foreground" value={settings.fgColor} onChange={(c) => setSettings(prev => ({ ...prev, fgColor: c }))} />
                <ColorPicker label="Background" value={settings.bgColor} onChange={(c) => setSettings(prev => ({ ...prev, bgColor: c }))} />
                <div className="md:col-span-2 pt-2">
                  <RangeSlider label="Size" value={settings.size} min={128} max={1024} step={16} onChange={(s) => setSettings(prev => ({ ...prev, size: s }))} />
                </div>
                <div className="md:col-span-2">
                   <ShapeSelector value={settings.style} onChange={(s) => setSettings(prev => ({ ...prev, style: s }))} />
                </div>
                <SelectControl label="Error Correction" value={settings.level} options={[{ label: 'Low (7%)', value: 'L' }, { label: 'Medium (15%)', value: 'M' }, { label: 'Quartile (25%)', value: 'Q' }, { label: 'High (30%)', value: 'H' }]} onChange={(l) => setSettings(prev => ({ ...prev, level: l as any }))} />
                <div className="flex items-center md:pt-6">
                  <label className="relative flex items-center gap-3 cursor-pointer group p-3 rounded-2xl hover:bg-[#F0F4F9] transition-colors w-full select-none">
                    <input type="checkbox" checked={settings.includeMargin} onChange={(e) => setSettings(prev => ({ ...prev, includeMargin: e.target.checked }))} className="peer appearance-none h-5 w-5 border-2 border-[#444746] rounded-md checked:bg-[#0B57D0] checked:border-[#0B57D0] transition-all cursor-pointer" />
                    <CheckCircle2 size={16} className="absolute left-[14px] top-[14px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    <div className="flex flex-col"><span className="text-sm font-medium text-[#1F1F1F]">Quiet Zone</span><span className="text-xs text-[#444746]">Add margin around code</span></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-5 reveal-on-scroll delay-100">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 p-8 relative overflow-hidden ring-1 ring-black/5">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570]"></div>
              <div className="flex flex-col items-center justify-center gap-10 pt-4">
                <div className="relative group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-md hover:scale-[1.01]">
                  <QRCodeCanvas ref={canvasRef} settings={settings} />
                </div>
                <div className="w-full space-y-4">
                  <button onClick={handleDownload} className={`w-full text-white px-8 py-5 rounded-full font-bold text-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group duration-300 ${downloadSuccess ? 'bg-[#0F5C2E] hover:bg-[#0F5C2E]' : 'bg-[#0B57D0] hover:bg-[#0B57D0]/90'}`}>
                    {downloadSuccess ? <><CheckCircle2 size={24} className="animate-[bounce_0.5s_ease-in-out]" />Saved!</> : <><Download size={22} className="group-hover:-translate-y-0.5 transition-transform" />Download PNG</>}
                  </button>
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={handleShare} className="w-full bg-white border border-gray-200 text-[#1F1F1F] hover:bg-gray-50 hover:border-gray-300 px-3 py-4 rounded-2xl font-medium transition-colors flex flex-col items-center justify-center gap-1 text-xs"><Share2 size={18} />Share</button>
                    <button onClick={handleCopyValue} className="w-full bg-white border border-gray-200 text-[#1F1F1F] hover:bg-gray-50 hover:border-gray-300 px-3 py-4 rounded-2xl font-medium transition-colors flex flex-col items-center justify-center gap-1 text-xs"><Copy size={18} />Copy Text</button>
                    <button onClick={handleEmbed} className="w-full bg-white border border-gray-200 text-[#1F1F1F] hover:bg-gray-50 hover:border-gray-300 px-3 py-4 rounded-2xl font-medium transition-colors flex flex-col items-center justify-center gap-1 text-xs"><Code size={18} />Embed</button>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-widest justify-center mb-3"><span>Share Link</span><div className="h-px bg-gray-100 flex-1"></div></div>
                    <div className="flex justify-center gap-3">
                       <button onClick={() => handleSocialShare('twitter')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Share on X (Twitter)"><Twitter size={18} fill="currentColor" /></button>
                       <button onClick={() => handleSocialShare('facebook')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Share on Facebook"><Facebook size={18} fill="currentColor" /></button>
                       <button onClick={() => handleSocialShare('whatsapp')} className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Share on WhatsApp"><MessageCircle size={18} fill="currentColor" /></button>
                    </div>
                  </div>
                </div>
                <div className="text-center"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{settings.size}px • High Res</p></div>
              </div>
            </div>

            <div className="bg-[#1F1F1F] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#4285F4] to-[#9B72CB] opacity-10 blur-[60px] rounded-full group-hover:opacity-20 transition-opacity duration-700"></div>
              <div className="relative flex items-start gap-5">
                <div className="p-2.5 bg-white/10 rounded-xl shrink-0 backdrop-blur-sm border border-white/5"><Wand2 className="text-[#D3E3FD]" size={20} /></div>
                <div><h3 className="font-bold text-base mb-2">Pro Tip</h3><p className="text-gray-300 text-sm leading-relaxed">Use the <strong>Magic AI</strong> tab to instantly create complex contact cards or Wi-Fi logins just by describing them.</p></div>
              </div>
            </div>
            
            <div className="mt-4"><AdSense /></div>
          </div>
        </div>
        
        <div className="lg:col-span-12"><SEOContent /></div>
      </div>
    </div>
  );
};
