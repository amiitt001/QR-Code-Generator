import React from 'react';
import { Shield, Smartphone, Zap, CheckCircle, HelpCircle, AlertTriangle, ExternalLink, RefreshCw, Star, TrendingUp, Users } from 'lucide-react';

export const SEOContent: React.FC = () => {
  return (
    <article className="mt-24 mb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-gray-700">
      
      {/* Article Header */}
      <header className="text-center space-y-6 reveal-on-scroll">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          The Ultimate Guide to Professional QR Codes
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about creating, optimizing, and securing QR codes for business, marketing, and personal use in 2025.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>Updated: October 2025</span>
          <span>•</span>
          <span>10 min read</span>
          <span>•</span>
          <span className="text-indigo-600 font-medium">Expert Verified</span>
        </div>
      </header>

      <hr className="border-gray-200 reveal-on-scroll" />

      {/* Success Stories Section (New) */}
      <section className="space-y-8 reveal-on-scroll">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Star size={24} fill="currentColor" /></div>
            <h3 className="text-3xl font-bold text-gray-900">Success Stories</h3>
         </div>
         <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <h4 className="font-bold text-lg mb-2 text-[#1F1F1F]">Cafe Boost</h4>
               <p className="text-sm text-gray-600 mb-4">"We placed a Wi-Fi QR code on every table. Customer questions dropped by 90% and average stay time increased."</p>
               <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <TrendingUp size={14} /> <span>Efficiency +40%</span>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <h4 className="font-bold text-lg mb-2 text-[#1F1F1F]">Networking Pro</h4>
               <p className="text-sm text-gray-600 mb-4">"I stopped buying paper business cards. Now I just show my phone screen, and clients save my contact instantly."</p>
               <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <Users size={14} /> <span>Connections +2x</span>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <h4 className="font-bold text-lg mb-2 text-[#1F1F1F]">Event Magic</h4>
               <p className="text-sm text-gray-600 mb-4">"Our wedding invitations had a Maps QR code. Not a single guest got lost finding the remote venue."</p>
               <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <ExternalLink size={14} /> <span>100% Arrival</span>
               </div>
            </div>
         </div>
      </section>

      {/* Section 2: Step-by-Step */}
      <section className="space-y-6 reveal-on-scroll">
        <h3 className="text-2xl font-bold text-gray-900">How to Create a QR Code: Step-by-Step</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <ol className="space-y-6">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center">1</span>
              <div>
                <h4 className="font-bold text-gray-900">Choose Your Data Type</h4>
                <p className="mt-1">Select what you want to share. Use <strong>URL</strong> for websites, <strong>Wi-Fi</strong> for network access, or <strong>vCard</strong> for digital business cards.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center">2</span>
              <div>
                <h4 className="font-bold text-gray-900">Input Information or Use AI</h4>
                <p className="mt-1">Enter the details manually, or use our <strong>Magic AI</strong> feature to parse complex data (like "WiFi for GuestNet password 12345") into the correct format automatically.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center">3</span>
              <div>
                <h4 className="font-bold text-gray-900">Customize & Test</h4>
                <p className="mt-1">Adjust colors and error correction levels. <strong>Crucial:</strong> Always test scan the code with your phone camera before downloading.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Section 2.5: Static vs Dynamic */}
      <section className="space-y-6 reveal-on-scroll">
        <h3 className="text-2xl font-bold text-gray-900">Static vs. Dynamic QR Codes</h3>
        <div className="grid md:grid-cols-2 gap-6">
           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 relative overflow-hidden hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Shield size={100} className="text-blue-600" />
              </div>
              <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-lg">
                 <Zap size={20} className="text-blue-600" /> 
                 Static QR Codes
              </h4>
              <p className="text-sm text-blue-800 mb-6 leading-relaxed font-medium">
                 This tool generates Static codes. The data is permanently encoded into the pixels.
              </p>
              <ul className="space-y-3 text-sm text-blue-700">
                 <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="shrink-0 mt-0.5 text-blue-600" /> 
                    <span><strong>Permanent:</strong> Works forever. No expiration date.</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="shrink-0 mt-0.5 text-blue-600" /> 
                    <span><strong>Private:</strong> Direct connection. No tracking servers.</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="shrink-0 mt-0.5 text-blue-600" /> 
                    <span><strong>Free:</strong> No monthly subscriptions required.</span>
                 </li>
              </ul>
           </div>

           <div className="bg-white p-8 rounded-2xl border border-gray-200 text-gray-500 relative overflow-hidden hover:border-gray-300 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <ExternalLink size={100} />
              </div>
              <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-lg">
                 <RefreshCw size={20} /> 
                 Dynamic QR Codes
              </h4>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                 Uses a redirect URL. Often requires a paid subscription service.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                 <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="shrink-0 mt-0.5" /> 
                    <span><strong>Editable:</strong> Change destination after printing.</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="shrink-0 mt-0.5" /> 
                    <span><strong>Trackable:</strong> Provides scan analytics.</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" /> 
                    <span><strong>Risk:</strong> Stops working if subscription ends.</span>
                 </li>
              </ul>
           </div>
        </div>
      </section>

      {/* Section 3: Best Practices */}
      <section className="space-y-8 reveal-on-scroll">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle className="text-indigo-600" />
          Best Practices for High-Performance QR Codes
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <h4 className="font-bold text-gray-900 mb-2">1. Contrast is King</h4>
            <p className="text-sm">Scanners rely on contrast. The foreground (pixels) should be dark and the background light. Avoid "inverted" codes (white pixels on dark background) as some older scanners cannot read them.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <h4 className="font-bold text-gray-900 mb-2">2. Respect the Quiet Zone</h4>
            <p className="text-sm">The empty white space around the code is called the Quiet Zone. It tells the scanner where the code starts and ends. Never crop this border closer than 4 modules (pixels).</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <h4 className="font-bold text-gray-900 mb-2">3. Size & Distance Ratio</h4>
            <p className="text-sm">A general rule of thumb is a 10:1 distance-to-size ratio. If a code needs to be scanned from 10 inches away, it should be at least 1 inch wide.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <h4 className="font-bold text-gray-900 mb-2">4. Error Correction</h4>
            <p className="text-sm">Use Level H (High) error correction if you plan to embed a logo in the center or if the code will be placed outdoors where it might get dirty.</p>
          </div>
        </div>
      </section>

      {/* Section 4: Security */}
      <section className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 border border-indigo-100 shadow-sm space-y-6 reveal-on-scroll">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600 rounded-lg text-white">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Security & Privacy: Avoiding "Quishing"</h3>
            <p className="text-gray-700 leading-relaxed">
              QR Phishing, or "Quishing," is a rising cybersecurity threat where attackers replace legitimate QR codes (like on parking meters) with malicious ones.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 pt-4">
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Risks
            </h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Redirecting to fake login pages.</li>
              <li>Triggering automatic malware downloads.</li>
              <li>Connecting to compromised Wi-Fi networks.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Shield size={18} className="text-green-600" />
              Prevention
            </h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Verify URL:</strong> Check the preview URL on your phone screen before tapping.</li>
              <li><strong>Use Static Codes:</strong> Tools like Gemini QR Studio generate <em>static</em> codes. The data is in the image, not routed through a tracking server, ensuring better privacy.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: Use Cases */}
      <section className="space-y-6 reveal-on-scroll">
        <h3 className="text-2xl font-bold text-gray-900">Real-World Use Cases</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <h4 className="font-bold text-lg">Contact Cards (vCard)</h4>
            <p className="text-sm text-gray-600">Replace paper business cards. A single scan adds your name, email, phone, and website directly to a client's address book.</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h4 className="font-bold text-lg">Instant Wi-Fi</h4>
            <p className="text-sm text-gray-600">Perfect for Airbnbs and cafes. Guests scan a code to join the Wi-Fi network instantly without typing complex passwords.</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <ExternalLink size={24} />
            </div>
            <h4 className="font-bold text-lg">Product Packaging</h4>
            <p className="text-sm text-gray-600">Link to manuals, video tutorials, or review pages directly from physical products to enhance customer experience.</p>
          </div>
        </div>
      </section>

      {/* Section 6: FAQ */}
      <section className="pt-10 border-t border-gray-200 space-y-8 reveal-on-scroll">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="text-gray-400" />
          Frequently Asked Questions
        </h3>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Do these QR codes expire?</h4>
            <p className="text-gray-600 text-sm">No. The QR codes generated here are <strong>static</strong>. This means the data is encoded directly into the pattern pixels. They will work forever as long as the image is readable.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Can I change the link later?</h4>
            <p className="text-gray-600 text-sm">For static codes, no. If you need the ability to change the destination URL after printing, you need a "Dynamic QR Code," which typically requires a paid subscription service.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Is there a scan limit?</h4>
            <p className="text-gray-600 text-sm">Absolutely not. Since there is no server in the middle, you can scan these codes millions of times with zero restrictions.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Are these codes commercial-free?</h4>
            <p className="text-gray-600 text-sm">Yes. You can use the QR codes generated by Gemini QR Studio for commercial products, marketing materials, and business cards without attribution.</p>
          </div>
        </div>
      </section>

    </article>
  );
};