'use client';

import { useState } from 'react';

export default function CallIntegration({ 
  templateContext = {},
  phoneNumber = '+919876543210',
  onCallInitiated = null,
  onCallCompleted = null,
  onCallFailed = null
}) {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');

  const initiateCall = async () => {
    if (isCalling) return;
    
    setIsCalling(true);
    setCallStatus('initiating');
    
    try {
      const response = await fetch('/api/make-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          templateContext
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCallStatus('connected');
        if (onCallInitiated) {
          onCallInitiated(result);
        }
        
        // Simulate call duration
        setTimeout(() => {
          setCallStatus('completed');
          setIsCalling(false);
          if (onCallCompleted) {
            onCallCompleted(result);
          }
        }, 30000); // 30 seconds simulation
        
      } else {
        throw new Error(result.message || 'Call failed');
      }
    } catch (error) {
      console.error('Call failed:', error);
      setCallStatus('failed');
      setIsCalling(false);
      if (onCallFailed) {
        onCallFailed(error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📞</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Assistant</h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect with our AI health assistant for immediate help
        </p>
        
        <button
          onClick={initiateCall}
          disabled={isCalling}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isCalling
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
          }`}
        >
          {isCalling ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            'Call AI Assistant'
          )}
        </button>
        
        {callStatus === 'connected' && (
          <p className="text-sm text-green-600 mt-2">Call connected successfully!</p>
        )}
        
        {callStatus === 'failed' && (
          <p className="text-sm text-red-600 mt-2">Call failed. Please try again.</p>
        )}
      </div>
    </div>
  );
}