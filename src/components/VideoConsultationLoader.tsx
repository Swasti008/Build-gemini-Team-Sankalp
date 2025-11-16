'use client';

import { useEffect } from 'react';

interface VideoConsultationLoaderProps {
  roomId: string;
  onComplete: () => void;
}

export default function VideoConsultationLoader({ roomId, onComplete }: VideoConsultationLoaderProps) {
  useEffect(() => {
    // Show loading for 3 seconds, then redirect
    const timer = setTimeout(() => {
      window.open(`https://nirmayaa.vercel.app/room/${roomId}`, '_blank', 'noopener,noreferrer');
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [roomId, onComplete]);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Primary Loading Indicator */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        
        {/* Title Text */}
        <h2 className="text-2xl font-bold text-white mb-4">Connecting to Doctor...</h2>
        
        {/* Instructional Text */}
        <p className="text-white text-lg mb-8">Please wait while we connect you</p>
        
        {/* Secondary Loading Indicator */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Baddi Logo */}
        <div className="absolute bottom-6 left-6">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
        </div>
      </div>
    </div>
  );
}






