import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
          <p>
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Gemini QR Studio ("we," "us" or "our"), concerning your access to and use of the Gemini QR Studio website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
          </p>
          <p className="mt-2">
            However, the <strong>QR codes you generate</strong> using our tool are yours to use for any purpose, including commercial usage, without attribution.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Prohibited Activities</h2>
          <p>
            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            As a user of the Site, you agree not to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Use the Site to generate QR codes that direct to malicious, illegal, or harmful content (phishing, malware, etc).</li>
            <li>Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Limitation of Liability</h2>
          <p>
            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
          </p>
          <p className="mt-2">
            We do not guarantee that the QR codes generated will be readable by all devices or in all conditions. Always test your QR codes before printing or mass distribution.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Modifications and Interruptions</h2>
          <p>
            We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Governing Law</h2>
          <p>
            These Terms shall be governed by and defined following the laws of the United States. Gemini QR Studio and yourself irrevocably consent that the courts of the United States shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
          </p>
        </section>
      </div>
    </div>
  );
};