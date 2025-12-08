import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
        <section>
          <p className="text-sm text-gray-500 mb-4">Last updated: October 26, 2025</p>
          <p>
            At QR Studio, accessible from our website, one of our main priorities is the privacy of our visitors.
            This Privacy Policy document contains types of information that is collected and recorded by QR Studio and how we use it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
          <p className="mb-2">
            <strong>Personal Data:</strong> We do not require you to create an account to use our standard QR generation tools.
            When you use our tool, we do not store the data you enter (such as URLs, text, or Wi-Fi passwords) on our servers.
            The QR code generation process happens securely within your browser environment or via stateless API calls.
          </p>
          <p>
            <strong>Log Files:</strong> Like many other Web sites, QR Studio makes use of log files.
            The information inside the log files includes internet protocol (IP) addresses, type of browser, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks.
            This data is not linked to any information that is personally identifiable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. AI Features & Data Processing</h2>
          <p>
            When you use our "Magic AI" feature, the text prompt you provide is transmitted to Google's Gemini API for processing.
            This is necessary to interpret your request and format the data correctly.
            By using this feature, you acknowledge that your input data is processed by Google in accordance with their <a href="https://policies.google.com/privacy" className="text-indigo-600 hover:underline" target="_blank" rel="noreferrer">Privacy Policy</a>.
            We do not retain or store your AI prompts after the session is complete.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cookies and Web Beacons</h2>
          <p>
            QR Studio uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.
            The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Advertising Partners Privacy Policies</h2>
          <p>
            We may use third-party advertising companies (such as Google AdSense) to serve ads when you visit our website.
            These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
          </p>
          <p className="mt-2">
            <strong>Google DoubleClick DART Cookie:</strong> Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
            However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p>
            Under the CCPA, among other rights, California consumers have the right to request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.
            If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. GDPR Data Protection Rights</h2>
          <p>
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
            The right to access, rectification, erasure, restrict processing, object to processing, and data portability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact Us</h2>
          <p>
            If you have any questions about our Privacy Policy, do not hesitate to contact us at <strong>privacy@geminiqr.studio</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};