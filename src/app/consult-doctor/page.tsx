'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

interface Specialty {
  id: string;
  name: string;
  icon: string;
  conditions: string[];
}

const specialties: Specialty[] = [
  {
    id: 'general',
    name: 'General Physician',
    icon: '🌡️',
    conditions: ['Fever', 'High blood pressure', 'Dizziness', 'Pneumonia']
  },
  {
    id: 'orthopedist',
    name: 'Orthopedist',
    icon: '🦴',
    conditions: ['Knee Pain', 'Shoulder Pain', 'Leg Pain', 'Carpal Tunnel Syndrome']
  },
  {
    id: 'dermatologist',
    name: 'Dermatologist',
    icon: '🧴',
    conditions: ['Vitiligo', 'Hair Loss', 'Acne Scars', 'Dandruff']
  },
  {
    id: 'ent',
    name: 'Ear-Nose-Throat (ENT)',
    icon: '👂',
    conditions: ['Sore Throat', 'Snoring', 'Coughing', 'Mouth Sores']
  },
  {
    id: 'gynecologist',
    name: 'Gynecologist/Obstetrician',
    icon: '👩',
    conditions: ['Menopause', 'Irregular Periods', 'Ovarian Cysts', 'Vaginal Discharge']
  }
];

interface ConditionIconProps {
  condition: string;
  specialty: string;
}

function ConditionIcon({ condition, specialty }: ConditionIconProps) {
  const getIcon = (condition: string, specialty: string) => {
    const iconMap: { [key: string]: string } = {
      'Fever': '🌡️',
      'High blood pressure': '❤️',
      'Dizziness': '🌀',
      'Pneumonia': '🫁',
      'Knee Pain': '🦵',
      'Shoulder Pain': '💪',
      'Leg Pain': '🦵',
      'Carpal Tunnel Syndrome': '✋',
      'Vitiligo': '🤚',
      'Hair Loss': '💇',
      'Acne Scars': '😷',
      'Dandruff': '❄️',
      'Sore Throat': '🗣️',
      'Snoring': '😴',
      'Coughing': '🤧',
      'Mouth Sores': '👄',
      'Menopause': '🔄',
      'Irregular Periods': '📅',
      'Ovarian Cysts': '🔴',
      'Vaginal Discharge': '💧'
    };
    return iconMap[condition] || '🏥';
  };

  return (
    <Link 
      href={`/book-appointment?specialty=${specialty}&condition=${encodeURIComponent(condition)}`}
      className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
        <span className="text-xl">{getIcon(condition, specialty)}</span>
      </div>
      <span className="text-xs text-center text-gray-700 font-medium leading-tight">
        {condition}
      </span>
    </Link>
  );
}

export default function ConsultDoctor() {
  const { t } = useLanguage();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Safe area spacing for mobile status bar */}
      <div className="h-6 bg-indigo-600"></div>
      
      {/* Header */}
      <div className="bg-indigo-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="text-white">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg">Consult a doctor</h1>
          <button className="text-white text-sm font-medium">HELP</button>
        </div>

        {/* Free Follow-up Banner */}
        <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg">Free follow-up</h3>
              <p className="text-sm text-indigo-100">for 7 days with every consultation</p>
              <button className="text-sm font-medium text-white mt-2">Know More →</button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <span className="text-sm">💬</span>
              </div>
              <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <span className="text-sm">💬</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Health Problem */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Health Problem / Symptoms"
            className="w-full px-4 py-3 pl-12 bg-white text-gray-900 rounded-xl text-sm placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Choose from Top Specialties */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">CHOOSE FROM TOP SPECIALITIES</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🧠</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Mental Wellness</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🤰</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Gynaecology</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🩺</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">General Physician</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🧴</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Dermatology</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🦴</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Orthopedic</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👶</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Pediatrics</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">❤️</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Sexology</span>
            </div>
            <Link href="/specialists" className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👁️</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">VIEW ALL</span>
            </Link>
          </div>
        </div>

        {/* Common Health Issues */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Common Health Issues</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🫁</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Stomach Pain</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🌀</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Vertigo</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-xl">😷</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Acne</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🔴</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">PCOS</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🦋</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Thyroid</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🤕</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Headaches</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🔍</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Fungal Infection</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🦴</span>
              </div>
              <span className="text-xs text-center text-gray-700 font-medium">Back Pain</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/video-consult" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">📹</div>
            <div className="text-sm font-medium">Video Consult</div>
            <div className="text-xs text-indigo-100">Connect instantly</div>
          </Link>
          <Link href="/ai-chat" className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center hover:border-indigo-300 transition-colors">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-medium text-gray-900">AI Assistant</div>
            <div className="text-xs text-gray-500">Get instant help</div>
          </Link>
        </div>

        {/* Emergency Section */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Emergency Care</h3>
              <p className="text-sm text-red-600 mt-1">For urgent medical situations</p>
            </div>
            <Link 
              href="/emergency"
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Call 108
            </Link>
          </div>
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
