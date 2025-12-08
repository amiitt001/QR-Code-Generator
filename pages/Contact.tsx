import React from 'react';
import { Mail, MessageSquare, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-500">
          Have a question, suggestion, or need support? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Email Support</h3>
              <p className="text-gray-600 text-sm mb-1">For general inquiries and technical support:</p>
              <a href="mailto:amitverma2k99@gmail.com" className="text-indigo-600 font-medium hover:underline">
                support@qr.studio
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Feedback</h3>
              <p className="text-gray-600 text-sm mb-1">Found a bug or have a feature request?</p>
              <a href="mailto:amitverma2k99@gmail.com" className="text-indigo-600 font-medium hover:underline">
                feedback@qr.studio
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Response Time</h3>
              <p className="text-gray-600 text-sm">
                We are a small, dedicated team. We aim to respond to all inquiries within <strong>24-48 business hours</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="font-bold text-lg text-gray-900 mb-6">Before you message us...</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">My QR Code isn't working?</h4>
              <p className="text-sm text-gray-500">
                Ensure there is high contrast between the foreground and background colors. Also, try reducing the complexity of the data or increasing the size.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Is this tool free?</h4>
              <p className="text-sm text-gray-500">
                Yes! QR Studio is completely free to use for both personal and commercial projects.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Do you save my data?</h4>
              <p className="text-sm text-gray-500">
                No. We respect your privacy. All processing is done locally or statelessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};