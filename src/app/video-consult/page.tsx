'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

export default function VideoConsult() {
  const { language, setLanguage } = useLanguage();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleStartConsultation = () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 3000);
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Connecting to Doctor...</h2>
          <p className="text-gray-300">Please wait while we connect you</p>
          <div className="mt-4 space-y-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mx-auto"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mx-auto" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mx-auto" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 relative">
        {/* Video Call Interface */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900">
          {/* Doctor's Video (Main) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-4xl">👩‍⚕️</span>
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              <p className="text-sm">Dr. Priya Sharma</p>
              <p className="text-xs text-gray-300">General Physician</p>
            </div>
          </div>

          {/* User's Video (Small) */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-gray-800 rounded-lg border-2 border-white">
            <div className="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6">
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isMuted ? 'bg-red-600' : 'bg-gray-600'
                } text-white`}
              >
                <span className="text-xl">{isMuted ? '🔇' : '🎤'}</span>
              </button>
              
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isVideoOff ? 'bg-red-600' : 'bg-gray-600'
                } text-white`}
              >
                <span className="text-xl">{isVideoOff ? '📹' : '📹'}</span>
              </button>
              
              <button
                onClick={handleEndCall}
                className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white"
              >
                <span className="text-xl">📞</span>
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-white text-sm">Call Duration: 05:23</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Safe area spacing for mobile status bar */}
      <div className="h-6 bg-blue-600"></div>
      
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg">Video Consultation</h1>
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Doctor Info */}
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👩‍⚕️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dr. Priya Sharma</h2>
          <p className="text-gray-600 mb-1">General Physician</p>
          <p className="text-sm text-gray-500">15 years experience</p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium">4.9 (127 reviews)</span>
          </div>
        </div>

        {/* Consultation Details */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Consultation Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">15-30 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fee:</span>
              <span className="font-medium">₹600</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available:</span>
              <span className="font-medium text-green-600">Now</span>
            </div>
          </div>
        </div>

        {/* Symptoms/Concerns */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Your Concerns</h3>
          <textarea
            placeholder="Describe your symptoms or health concerns..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Quick Symptoms */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Symptoms</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Fever', 'Cough', 'Headache', 'Stomach Pain', 'Cold', 'Body Ache'].map((symptom) => (
              <button
                key={symptom}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Start Consultation Button */}
        <button
          onClick={handleStartConsultation}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2"
        >
          <span>📹</span>
          <span>Start Video Consultation</span>
        </button>

        {/* Alternative Options */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Having connection issues?</h3>
          <div className="space-y-2">
            <Link 
              href="/ai-chat"
              className="block bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium text-center"
            >
              🤖 Try AI Assistant (Free)
            </Link>
            <button className="w-full bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
              📞 Switch to Voice Call
            </button>
          </div>
        </div>

        {/* Technical Requirements */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Technical Requirements</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Stable internet connection (minimum 1 Mbps)</li>
            <li>• Camera and microphone access</li>
            <li>• Chrome, Safari, or Firefox browser</li>
            <li>• Good lighting for video quality</li>
          </ul>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/appointments" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">📅</span>
            <span className="text-xs">Appointments</span>
          </Link>
          <Link href="/records" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">📋</span>
            <span className="text-xs">Records</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );
}
