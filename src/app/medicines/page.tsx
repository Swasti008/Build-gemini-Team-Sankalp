'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  price: number;
  availability: boolean;
  pharmacy: string;
  distance: string;
}

const medicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    genericName: 'Paracetamol',
    dosage: '10 tablets',
    price: 15,
    availability: true,
    pharmacy: 'Baddi Medical Store',
    distance: '0.5 km'
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    dosage: '10 capsules',
    price: 45,
    availability: true,
    pharmacy: 'Baddi Pharmacy',
    distance: '2.1 km'
  },
  {
    id: '3',
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine',
    dosage: '10 tablets',
    price: 25,
    availability: false,
    pharmacy: 'Rural Health Center',
    distance: '1.2 km'
  }
];

export default function Medicines() {
  const { t, language, setLanguage, cycleLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Safe area spacing for mobile status bar */}
      <div className="h-6 bg-white"></div>
      
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-gray-600">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg text-gray-900">{t('medicines.title')}</h1>
          <button
            onClick={cycleLanguage}
            className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium"
          >
            {language === 'en' ? 'EN' : language === 'hi' ? 'हिं' : 'ਪੰ'}
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
            placeholder={t('medicines.searchPlaceholder')}
            className="w-full px-4 py-3 pl-12 bg-gray-50 text-gray-900 rounded-xl text-sm placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        {/* Quick Categories */}
        <div className="grid grid-cols-4 gap-3">
          <button className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">🌡️</div>
            <span className="text-xs font-medium text-gray-700">{t('medicines.categories.fever')}</span>
          </button>
          <button className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">🤧</div>
            <span className="text-xs font-medium text-gray-700">{t('medicines.categories.cold')}</span>
          </button>
          <button className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">🤕</div>
            <span className="text-xs font-medium text-gray-700">{t('medicines.categories.pain')}</span>
          </button>
          <button className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">💊</div>
            <span className="text-xs font-medium text-gray-700">{t('medicines.categories.all')}</span>
          </button>
        </div>

        {/* Medicines List */}
        <div className="space-y-4">
          {filteredMedicines.map((medicine) => (
            <div key={medicine.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              {/* Main Data Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{medicine.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{t('medicines.generic')}: {medicine.genericName}</p>
                  {/* <p className="text-sm text-gray-500 mb-2">{medicine.dosage}</p> */}
                  {/* <p className="font-bold text-gray-900 text-lg">₹{medicine.price}</p> */}
                </div>
                
                {/* Status Indicator */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-center ${
                  medicine.availability 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className="text-xs font-medium leading-tight">
                    {medicine.availability ? t('medicines.available') : t('medicines.outOfStock')}
                  </span>
                </div>
              </div>
              
              {/* Bottom Section - Location and Action */}
              <div className="flex items-center justify-between">
                {/* Location Info */}
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">📍</span>
                    <span className="text-sm text-gray-700 font-medium">{medicine.pharmacy}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-5">{medicine.distance}</p>
                </div>
                
                {/* Call Button */}
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  {t('medicines.call')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Prescription Upload */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-lg">📄</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-indigo-900">{t('medicines.uploadPrescription')}</h3>
              <p className="text-sm text-indigo-700">{t('medicines.uploadPrescriptionDescription')}</p>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {t('medicines.upload')}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/ai-chat" className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-medium text-blue-800">{t('medicines.aiAssistant')}</div>
            <div className="text-xs text-blue-600">{t('medicines.medicineAdvice')}</div>
          </Link>
          <Link href="/pharmacy" className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🏪</div>
            <div className="text-sm font-medium text-green-800">{t('medicines.findPharmacy')}</div>
            <div className="text-xs text-green-600">{t('medicines.nearbyStores')}</div>
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
