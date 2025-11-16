'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Emergency() {
  const [isCalling, setIsCalling] = useState(false);

  const handleEmergencyCall = () => {
    setIsCalling(true);
    
    // Simulate emergency call
    setTimeout(() => {
      setIsCalling(false);
      alert('Emergency services have been notified. Help is on the way.');
    }, 3000);
  };

  const emergencyContacts = [
    { name: 'Ambulance', number: '108', description: 'Medical Emergency' },
    { name: 'Police', number: '100', description: 'Law Enforcement' },
    { name: 'Fire Service', number: '101', description: 'Fire Emergency' },
    { name: 'Women Helpline', number: '181', description: 'Women Safety' },
    { name: 'Child Helpline', number: '1098', description: 'Child Protection' },
    { name: 'Mental Health', number: '1800-599-0019', description: 'Crisis Support' }
  ];

  const emergencySymptoms = [
    { symptom: 'Chest Pain', severity: 'High', color: 'bg-red-100 text-red-800' },
    { symptom: 'Difficulty Breathing', severity: 'High', color: 'bg-red-100 text-red-800' },
    { symptom: 'Severe Bleeding', severity: 'High', color: 'bg-red-100 text-red-800' },
    { symptom: 'Unconsciousness', severity: 'High', color: 'bg-red-100 text-red-800' },
    { symptom: 'Severe Headache', severity: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { symptom: 'High Fever', severity: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { symptom: 'Severe Vomiting', severity: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { symptom: 'Allergic Reaction', severity: 'High', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="min-h-screen bg-red-50">
      {/* Safe area spacing for mobile status bar */}
      <div className="h-6 bg-red-600"></div>
      
      {/* Header */}
      <div className="bg-red-600 text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg">Emergency</h1>
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Emergency Call Button */}
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚨</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Medical Emergency</h2>
          <p className="text-gray-600 mb-4">Call for immediate medical assistance</p>
          
          <button
            onClick={handleEmergencyCall}
            disabled={isCalling}
            className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 ${
              isCalling 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            {isCalling ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Calling...</span>
              </>
            ) : (
              <>
                <span>📞</span>
                <span>Call 108 - Ambulance</span>
              </>
            )}
          </button>
        </div>

        {/* Emergency Symptoms */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Emergency Symptoms</h3>
          <div className="grid grid-cols-1 gap-2">
            {emergencySymptoms.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{item.symptom}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.color}`}>
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Emergency Contacts</h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Call {contact.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Nearby Hospitals</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Baddi Civil Hospital</h4>
                <p className="text-sm text-gray-600">0.5 km • 24/7 Emergency</p>
              </div>
              <div className="flex space-x-2">
                <a
                  href="tel:+919876543210"
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Call
                </a>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  Directions
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Baddi Medical Center</h4>
                <p className="text-sm text-gray-600">2.1 km • Emergency Available</p>
              </div>
              <div className="flex space-x-2">
                <a
                  href="tel:+919876543211"
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Call
                </a>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  Directions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* First Aid Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-3">Quick First Aid Tips</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• <strong>Bleeding:</strong> Apply direct pressure with clean cloth</p>
            <p>• <strong>Burns:</strong> Cool with running water for 10-15 minutes</p>
            <p>• <strong>Choking:</strong> Perform Heimlich maneuver</p>
            <p>• <strong>Unconscious:</strong> Check breathing, call for help</p>
          </div>
        </div>

        {/* Alternative Options */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Not an emergency?</h3>
          <div className="space-y-2">
            <Link 
              href="/ai-chat"
              className="block bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium text-center"
            >
              🤖 Chat with AI Assistant
            </Link>
            <Link 
              href="/consult-doctor"
              className="block bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium text-center"
            >
              👩‍⚕️ Book Doctor Appointment
            </Link>
          </div>
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
