'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiClient, Pharmacy, Medicine } from '../../lib/api';

interface PharmacyWithDistance extends Pharmacy {
  distance: string;
}

// Mock data for pharmacies with distances
const mockPharmacies: PharmacyWithDistance[] = [
  {
    id: '1',
    name: 'Baddi Medical Store',
    address: 'Near Civil Hospital, Baddi',
    phone_number: '+91 98765 43210',
    location_area: 'Baddi',
    distance: '0.5 km',
    inventory: []
  },
  {
    id: '2',
    name: 'Baddi Pharmacy',
    address: 'Main Market, Baddi',
    phone_number: '+91 98765 43211',
    location_area: 'Baddi',
    distance: '2.1 km',
    inventory: []
  },
  {
    id: '3',
    name: 'Rural Health Center',
    address: 'Village Center, Baddi',
    phone_number: '+91 98765 43212',
    location_area: 'Baddi',
    distance: '1.2 km',
    inventory: []
  }
];

export default function PharmacyPage() {
  const { t, language, cycleLanguage } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<string>('');
  const [pharmacies, setPharmacies] = useState<PharmacyWithDistance[]>(mockPharmacies);
  const [searchResults, setSearchResults] = useState<{ pharmacy: PharmacyWithDistance; medicines: Medicine[] }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const commonMedicines = [
    'Paracetamol 500mg',
    'Amoxicillin 250mg',
    'Cetirizine 10mg',
    'Omeprazole 20mg',
    'Metformin 500mg',
    'Amlodipine 5mg'
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      searchMedicine();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchMedicine = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await apiClient.searchMedicineInPharmacies(searchQuery);
      // Convert API results to match our interface
      const convertedResults = results.map(result => ({
        pharmacy: {
          ...result.pharmacy,
          distance: '0.5 km' // Default distance since API doesn't provide it
        } as PharmacyWithDistance,
        medicines: result.medicines
      }));
      setSearchResults(convertedResults);
    } catch (error) {
      console.error('Failed to search medicine:', error);
      // Fallback to mock search
      const mockResults = pharmacies.filter(pharmacy =>
        pharmacy.inventory.some(medicine =>
          medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ).map(pharmacy => ({
        pharmacy,
        medicines: pharmacy.inventory.filter(medicine =>
          medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }));
      setSearchResults(mockResults);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailabilityStatus = (medicine: Medicine) => {
    if (medicine.status === 'in stock') {
      return { text: 'Available', color: 'text-green-600 bg-green-100' };
    }
    return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Safe area spacing for mobile status bar */}
        <div className="h-6 bg-gray-50"></div>
        
        {/* Header */}
        <div className="bg-white px-4 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-gray-600">
              <span className="text-xl">←</span>
            </Link>
            <h1 className="font-semibold text-lg text-gray-900">{t('pharmacy.title')}</h1>
            <button
              onClick={cycleLanguage}
              className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {language === 'en' ? 'EN' : language === 'hi' ? 'हिं' : 'ਪੰ'}
            </button>
          </div>
        </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('pharmacy.searchMedicine')}
              className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Common Medicines */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">{t('pharmacy.commonMedicines')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {commonMedicines.map((medicine) => (
              <button
                key={medicine}
                onClick={() => setSearchQuery(medicine)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-left transition-colors"
              >
                {medicine}
              </button>
            ))}
          </div>
        </div>

        {/* Pharmacy Results */}
        {searchQuery && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">{t('pharmacy.availableAt')}</h3>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="text-gray-500">{t('pharmacy.searching')}</div>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map(({ pharmacy, medicines }) => (
                <div key={pharmacy.id} className="bg-white rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{pharmacy.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{pharmacy.address}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          📍 {pharmacy.distance}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          📞 {pharmacy.phone_number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Medicine Availability */}
                  <div className="space-y-2">
                    {medicines.map((medicine) => {
                        const status = getAvailabilityStatus(medicine);
                        return (
                          <div key={medicine.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{medicine.name}</p>
                              <p className="text-xs text-gray-600">{t('common.category')}: {medicine.category}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                                {status.text}
                              </span>
                              {medicine.status === 'in stock' && (
                                <p className="text-sm font-medium text-gray-900 mt-1">{t('pharmacy.available')}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-3">
                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium">
                      📞 {t('pharmacy.callPharmacy')}
                    </button>
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
                      📍 {t('pharmacy.getDirections')}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">😔</div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('pharmacy.medicineNotFound')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('pharmacy.notAvailable').replace('{query}', searchQuery)}
                </p>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">
                    🔍 {t('pharmacy.searchAlternatives')}
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium">
                    📞 {t('pharmacy.contactDoctor')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/ai-chat"
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
          >
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-medium text-blue-800">{t('common.aiAssistant')}</div>
            <div className="text-xs text-blue-600">{t('medicines.medicineAdvice')}</div>
          </Link>
          <Link 
            href="/emergency"
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
          >
            <div className="text-2xl mb-2">🚨</div>
            <div className="text-sm font-medium text-red-800">{t('emergency.title')}</div>
            <div className="text-xs text-red-600">{t('emergency.call108')}</div>
          </Link>
        </div>

        {/* Offline Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <div>
              <h4 className="font-medium text-yellow-800">{t('pharmacy.offlineModeAvailable')}</h4>
              <p className="text-sm text-yellow-700 mt-1">
                {t('pharmacy.cachedInfo')}. {t('pharmacy.lastUpdated').replace('{time}', '2 hours')}.
              </p>
            </div>
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
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-green-600">
            <span className="text-lg">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-20"></div>
      </div>
    </ProtectedRoute>
  );
}
