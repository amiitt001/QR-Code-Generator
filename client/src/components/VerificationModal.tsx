import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { SecurityService } from '../utils/security';

interface VerificationModalProps {
  isOpen: boolean;
  onVerify: () => void;
  onCancel: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onVerify, onCancel }) => {
  const [challenge, setChallenge] = useState({ question: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [isShake, setIsShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setChallenge(SecurityService.generateChallenge());
      setUserAnswer('');
      setError('');
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAnswer) === challenge.answer) {
      setError('');
      onVerify();
    } else {
      setError('Incorrect. Please try again.');
      setIsShake(true);
      setTimeout(() => setIsShake(false), 300);
      setChallenge(SecurityService.generateChallenge()); // Rotate challenge on failure
      setUserAnswer('');
      SecurityService.logAttempt('VERIFICATION_FAILED');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all duration-200 ${isShake ? 'translate-x-[-4px]' : ''}`}
      >
        {/* Header Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570]" />
        
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0B57D0]">
              <ShieldCheck size={32} />
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-[#1F1F1F] mb-2">Security Check</h3>
            <p className="text-[#444746] text-sm">
              Please solve this quick puzzle to prove you're human and proceed with generation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 text-center">
              <span className="block text-xs font-bold text-[#444746] uppercase tracking-wider mb-2">Solve This</span>
              <div className="text-3xl font-mono font-bold text-[#1F1F1F] tracking-widest">
                {challenge.question} = ?
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="number"
                  placeholder="Enter result"
                  className={`w-full text-center text-lg pl-4 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none transition-all ${
                    error 
                      ? 'border-red-300 focus:border-red-500 bg-red-50 text-red-900' 
                      : 'border-gray-100 focus:border-[#0B57D0] text-[#1F1F1F]'
                  }`}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                {userAnswer && !error && (
                   <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#0B57D0] text-white rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     <ArrowRight size={16} />
                   </button>
                )}
              </div>
              {error && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 font-medium animate-pulse">
                  <AlertCircle size={12} />
                  {error}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#1F1F1F] text-white rounded-xl text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-gray-200"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};