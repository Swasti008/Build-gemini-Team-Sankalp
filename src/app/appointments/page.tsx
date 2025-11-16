'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

interface Appointment {
  id: string;
  type: string;
  title?: string; // For backward compatibility
  titleKey?: string; // Translation key for title
  status: string;
  date: string;
  description?: string; // For backward compatibility
  descriptionKey?: string; // Translation key for description
  phoneNumber: string;
  name: string;
}

export default function Appointments() {
  const { t, language, setLanguage, cycleLanguage } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load appointments from localStorage
    const loadAppointments = () => {
      try {
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
          setAppointments(JSON.parse(storedAppointments));
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []); // Load appointments once on mount

  // Separate useEffect for language changes
  useEffect(() => {
    // Force re-render when language changes by updating state
    setAppointments(prev => [...prev]);
  }, [language]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('appointments.pending');
      case 'confirmed': return t('appointments.confirmed');
      case 'cancelled': return t('appointments.cancelled');
      case 'completed': return t('appointments.completed');
      default: return status;
    }
  };

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
          <h1 className="font-semibold text-lg">{t('appointments.title')}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={cycleLanguage}
              className="px-3 py-1 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-full text-xs font-medium text-blue-900 transition-all"
            >
              {language === 'en' ? 'EN' : language === 'hi' ? 'हिं' : 'ਪੰ'}
            </button>
            <Link href="/book-appointment" className="text-white text-sm font-medium">
              Book
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {appointment.titleKey ? t(appointment.titleKey) : appointment.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-base mb-4">
                    {appointment.descriptionKey ? t(appointment.descriptionKey) : appointment.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>👤 {appointment.name}</span>
                    <span>📅 {new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('appointments.noAppointments')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('appointments.noAppointmentsDescription')}
            </p>
            <Link
              href="/book-appointment"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {t('appointments.bookNew')}
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">🏠</span>
            <span className="text-xs">{t('common.home')}</span>
          </Link>
          <Link href="/appointments" className="flex flex-col items-center space-y-1 text-blue-600">
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
