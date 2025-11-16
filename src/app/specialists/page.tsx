'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  nextAvailable: string;
  fee: number;
  image: string;
  description: string;
  languages: string[];
}

const specialists: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'General Physician',
    experience: '15 years',
    rating: 4.9,
    reviews: 127,
    nextAvailable: 'Today 2:00 PM',
    fee: 500,
    image: '👨‍⚕️',
    description: 'Experienced general physician with expertise in preventive care and chronic disease management.',
    languages: ['English', 'Hindi', 'Punjabi']
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrician',
    experience: '12 years',
    rating: 4.8,
    reviews: 98,
    nextAvailable: 'Tomorrow 10:00 AM',
    fee: 600,
    image: '👩‍⚕️',
    description: 'Pediatric specialist focused on child health and development.',
    languages: ['English', 'Hindi']
  },
  {
    id: '3',
    name: 'Dr. Amit Singh',
    specialty: 'Orthopedist',
    experience: '18 years',
    rating: 4.7,
    reviews: 156,
    nextAvailable: 'Today 4:00 PM',
    fee: 800,
    image: '👨‍⚕️',
    description: 'Orthopedic surgeon specializing in joint replacement and sports injuries.',
    languages: ['English', 'Hindi', 'Punjabi']
  },
  {
    id: '4',
    name: 'Dr. Sunita Gupta',
    specialty: 'Gynecologist',
    experience: '14 years',
    rating: 4.9,
    reviews: 89,
    nextAvailable: 'Tomorrow 11:00 AM',
    fee: 700,
    image: '👩‍⚕️',
    description: 'Women\'s health specialist with expertise in reproductive health.',
    languages: ['English', 'Hindi']
  },
  {
    id: '5',
    name: 'Dr. Vikram Malhotra',
    specialty: 'Cardiologist',
    experience: '20 years',
    rating: 4.8,
    reviews: 203,
    nextAvailable: 'Monday 9:00 AM',
    fee: 1000,
    image: '👨‍⚕️',
    description: 'Cardiologist specializing in heart disease prevention and treatment.',
    languages: ['English', 'Hindi']
  },
  {
    id: '6',
    name: 'Dr. Neha Aggarwal',
    specialty: 'Dermatologist',
    experience: '10 years',
    rating: 4.6,
    reviews: 76,
    nextAvailable: 'Tomorrow 3:00 PM',
    fee: 600,
    image: '👩‍⚕️',
    description: 'Dermatologist specializing in skin, hair, and nail conditions.',
    languages: ['English', 'Hindi']
  }
];

export default function Specialists() {
  const { t, language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', 'General Physician', 'Pediatrician', 'Orthopedist', 'Gynecologist', 'Cardiologist', 'Dermatologist'];

  const filteredSpecialists = specialists.filter(specialist => {
    const matchesSearch = specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         specialist.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || specialist.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link href="/consult-doctor" className="text-gray-600">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg text-gray-900">{t('specialists.title')}</h1>
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
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors by name or specialty..."
            className="w-full px-4 py-3 pl-12 bg-gray-50 text-gray-900 rounded-xl text-sm placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        {/* Specialty Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedSpecialty === specialty
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Specialists List */}
        <div className="space-y-4">
          {filteredSpecialists.map((specialist) => (
            <div key={specialist.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{specialist.image}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{specialist.name}</h3>
                      <p className="text-sm text-gray-600">{specialist.specialty}</p>
                      <p className="text-xs text-gray-500 mt-1">{specialist.experience} experience</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium">{specialist.rating}</span>
                        <span className="text-xs text-gray-500">({specialist.reviews})</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">₹{specialist.fee}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{specialist.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span>🕐</span>
                      <span>{specialist.nextAvailable}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🗣️</span>
                      <span>{specialist.languages.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/book-appointment?doctor=${specialist.id}`}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium text-center"
                    >
                      Book Appointment
                    </Link>
                    <Link
                      href={`/doctor-profile/${specialist.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium text-center"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSpecialists.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">👩‍⚕️</div>
            <h3 className="font-semibold text-gray-900 mb-2">No specialists found</h3>
            <p className="text-sm text-gray-600 mb-4">
              Try adjusting your search criteria or browse all specialties
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}

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

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🚨</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Emergency?</h3>
              <p className="text-sm text-red-700 mt-1">For urgent medical situations, call 108 immediately</p>
            </div>
            <Link href="/emergency" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Emergency
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
