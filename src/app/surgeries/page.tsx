'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

interface Surgery {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  recoveryTime: string;
  estimatedCost: number;
  available: boolean;
  hospital: string;
  doctor: string;
}

const surgeries: Surgery[] = [
  {
    id: '1',
    name: 'Appendectomy',
    description: 'Removal of appendix',
    category: 'Emergency',
    duration: '1-2 hours',
    recoveryTime: '2-4 weeks',
    estimatedCost: 25000,
    available: true,
    hospital: 'Baddi Civil Hospital',
    doctor: 'Dr. Rajesh Kumar'
  },
  {
    id: '2',
    name: 'Cataract Surgery',
    description: 'Eye lens replacement',
    category: 'Elective',
    duration: '30-45 minutes',
    recoveryTime: '1-2 weeks',
    estimatedCost: 35000,
    available: true,
    hospital: 'Baddi Medical Center',
    doctor: 'Dr. Priya Sharma'
  },
  {
    id: '3',
    name: 'Gallbladder Removal',
    description: 'Laparoscopic gallbladder surgery',
    category: 'Elective',
    duration: '1-2 hours',
    recoveryTime: '1-2 weeks',
    estimatedCost: 45000,
    available: true,
    hospital: 'Baddi Civil Hospital',
    doctor: 'Dr. Amit Singh'
  },
  {
    id: '4',
    name: 'Hernia Repair',
    description: 'Surgical repair of hernia',
    category: 'Elective',
    duration: '1-2 hours',
    recoveryTime: '2-4 weeks',
    estimatedCost: 30000,
    available: true,
    hospital: 'Baddi Medical Center',
    doctor: 'Dr. Rajesh Kumar'
  }
];

export default function Surgeries() {
  const { t, language, setLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);

  const categories = ['All', 'Emergency', 'Elective', 'Cosmetic'];

  const filteredSurgeries = surgeries.filter(surgery => 
    selectedCategory === 'All' || surgery.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-gray-600">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg text-gray-900">{t('home.surgeries')}</h1>
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium"
          >
            {language === 'en' ? 'हिं' : 'EN'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Emergency Surgery Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🚨</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Emergency Surgery</h3>
              <p className="text-sm text-red-700 mt-1">For life-threatening conditions, call 108 immediately</p>
            </div>
            <Link href="/emergency" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Emergency
            </Link>
          </div>
        </div>

        {/* Surgery Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-3">Before Booking Surgery</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Consult with doctor for proper diagnosis</p>
            <p>• Get second opinion if needed</p>
            <p>• Understand risks and benefits</p>
            <p>• Check insurance coverage</p>
          </div>
        </div>

        {/* Surgeries List */}
        <div className="space-y-4">
          {filteredSurgeries.map((surgery) => (
            <div key={surgery.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{surgery.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      surgery.category === 'Emergency' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {surgery.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{surgery.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>Duration: {surgery.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🏥</span>
                      <span>Recovery: {surgery.recoveryTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{surgery.estimatedCost.toLocaleString()}</p>
                  <span className="text-xs text-gray-500">Estimated</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">🏥</span>
                    <span className="text-sm text-gray-700">{surgery.hospital}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">👨‍⚕️</span>
                    <span className="text-sm text-gray-700">{surgery.doctor}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium">
                    Book Consultation
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Insurance Information */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🛡️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Insurance Coverage</h3>
              <p className="text-sm text-green-700 mt-1">Check with your insurance provider for coverage details</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Check Coverage
            </button>
          </div>
        </div>

        {/* Pre-Surgery Checklist */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-900 mb-3">Pre-Surgery Checklist</h3>
          <div className="space-y-2 text-sm text-yellow-700">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>Complete medical evaluation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>Lab tests and imaging</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>Anesthesia consultation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>Pre-surgery instructions</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/book-appointment" className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">👩‍⚕️</div>
            <div className="text-sm font-medium text-blue-800">Consult Doctor</div>
            <div className="text-xs text-blue-600">Get expert opinion</div>
          </Link>
          <Link href="/ai-chat" className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-medium text-green-800">AI Assistant</div>
            <div className="text-xs text-green-600">Surgery information</div>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">🏠</span>
            <span className="text-xs">{t('common.home')}</span>
          </Link>
          <Link href="/appointments" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">📅</span>
            <span className="text-xs">{t('common.appointments')}</span>
          </Link>
          <Link href="/records" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">📋</span>
            <span className="text-xs">{t('common.records')}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">👤</span>
            <span className="text-xs">{t('common.profile')}</span>
          </Link>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );
}
