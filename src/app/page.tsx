'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import VideoConsultationLoader from '../components/VideoConsultationLoader';
import { apiClient, UserProfile } from '../lib/api';

// Service card component
interface ServiceCardProps {
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  color: string;
}

function ServiceCard({ title, subtitle, icon, href, color }: ServiceCardProps) {
  return (
    <Link href={href} className="block">
      <div className="card p-4 h-full cursor-pointer">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Specialty icon component
interface SpecialtyIconProps {
  icon: string;
  label: string;
  href: string;
}

function SpecialtyIcon({ icon, label, href }: SpecialtyIconProps) {
  return (
    <Link href={href} className="flex flex-col items-center space-y-2 p-2">
      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
        <span className="text-xl">{icon}</span>
      </div>
      <span className="text-xs text-center text-gray-700 font-medium leading-tight">{label}</span>
    </Link>
  );
}

export default function Home() {
  const { t, language, cycleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoLoader, setShowVideoLoader] = useState(false);
  const [showCallConfirmation, setShowCallConfirmation] = useState(false);
  const [callCountdown, setCallCountdown] = useState(0);

  useEffect(() => {
    if (user?.isAuthenticated && user.phoneNumber) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.phoneNumber) return;
    
    try {
      setIsLoading(true);
      const profile = await apiClient.getUserProfile(user.phoneNumber);
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'en': return 'EN';
      case 'hi': return 'हिं';
      case 'pa': return 'ਪੰ';
      default: return 'EN';
    }
  };

  const handleVideoConsultation = () => {
    setShowVideoLoader(true);
  };

  const handleVideoLoaderComplete = () => {
    setShowVideoLoader(false);
  };

  const handleTalkToAgent = async () => {
    setShowCallConfirmation(true);
    setCallCountdown(10);
    
    try {
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCallCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Create appointment entry after countdown
      setTimeout(async () => {
        setShowCallConfirmation(false);
        setCallCountdown(0);
        
        // Create appointment entry with translation keys
        const appointmentData = {
          id: `appointment-${Date.now()}`,
          type: 'agent_call',
          titleKey: 'common.agentCall', // Store translation key instead of translated text
          status: 'pending',
          date: new Date().toISOString(),
          descriptionKey: 'common.awaitingDoctorResponse', // Store translation key instead of translated text
          phoneNumber: user?.phoneNumber,
          name: userProfile?.name || 'User'
        };

        // Get existing appointments from localStorage
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Add new appointment
        const updatedAppointments = [...existingAppointments, appointmentData];
        
        // Save to localStorage
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        
        // Show success message
        alert(t('common.callCompleted'));
        
      }, 10000); // 10 seconds
      
    } catch (error) {
      console.error('Error handling agent call:', error);
      setShowCallConfirmation(false);
      setCallCountdown(0);
    }
  };

  return (
    <ProtectedRoute>
      {showVideoLoader && (
        <VideoConsultationLoader 
          roomId="68d7c290efab985938a9ffee" 
          onComplete={handleVideoLoaderComplete} 
        />
      )}
      {showCallConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('common.callInProgress')}</h3>
            <p className="text-gray-600 mb-4">{t('common.connectingAgent')}</p>
            {callCountdown > 0 && (
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {callCountdown}
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6">
              {t('common.consultationRecorded')}
            </p>
            <button
              onClick={() => {
                setShowCallConfirmation(false);
                setCallCountdown(0);
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              {t('common.cancelCall')}
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-white">
      {/* Safe area spacing for mobile status bar */}
      <div className="h-6 bg-white"></div>
      
      {/* Header with greeting */}
      <div className="bg-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-lg">👋</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {isLoading ? t('common.loading') : `${t('common.hello')}, ${userProfile?.name || user?.name || t('common.user')}`}
              </h1>
              <div className="flex items-center space-x-1">
                <span className="text-red-500 text-sm">📍</span>
                <p className="text-sm text-gray-600">{t('common.baddiHimachal')}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={cycleLanguage}
              className="px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded-full text-xs font-medium text-purple-800 transition-colors"
            >
              {getLanguageLabel()}
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                {t('common.logout')}
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm">👤</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full px-4 py-3 pl-12 bg-gray-50 text-gray-900 rounded-xl text-sm placeholder-gray-500 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
            {/* Service Categories - Two main cards */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/book-appointment" className="block">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 h-36 flex flex-col justify-center items-center shadow-lg">
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">🏥</span>
                  </div>
                  <h3 className="font-bold text-lg text-center">{t('home.physicalAppointment')}</h3>
                  <p className="text-sm text-purple-100 mt-1 text-center">{t('home.atHospital')}</p>
                </div>
              </Link>

              <button 
                onClick={handleVideoConsultation}
                className="block w-full"
              >
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-36 flex flex-col justify-center items-center hover:border-green-300 transition-all shadow-sm">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">📹</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 text-center">{t('home.videoConsult')}</h3>
                  <p className="text-sm text-gray-500 mt-1 text-center">{t('home.connectIn5Sec')}</p>
                </div>
              </button>
            </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">{t('common.quickActions')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleTalkToAgent}
              className="flex flex-col items-center space-y-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xl">📞</span>
              </div>
              <span className="text-sm text-gray-800 font-medium">{t('common.talkToAgent')}</span>
            </button>
            <button 
              onClick={handleVideoConsultation}
              className="flex flex-col items-center space-y-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-100"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xl">📹</span>
              </div>
              <span className="text-sm text-gray-800 font-medium">{t('common.videoConsult')}</span>
            </button>
          </div>
        </div>

        {/* Additional Services */}
        <div className="grid grid-cols-3 gap-3">
          <Link href="/medicines" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-purple-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <span className="text-xl">💊</span>
            </div>
            <span className="text-sm font-medium text-gray-800">{t('home.medicines')}</span>
          </Link>
          <Link href="/lab-tests" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-orange-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <span className="text-xl">🧪</span>
            </div>
            <span className="text-sm font-medium text-gray-800">{t('home.labTests')}</span>
          </Link>
          <Link href="/emergency" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-red-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <span className="text-xl">🚨</span>
            </div>
            <span className="text-sm font-medium text-gray-800">{t('home.emergency')}</span>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center space-y-1 text-blue-600">
            <span className="text-lg">🏠</span>
            <span className="text-xs font-medium">{t('common.home')}</span>
          </Link>
          <Link href="/appointments" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">📅</span>
            <span className="text-xs font-medium">{t('common.appointments')}</span>
          </Link>
          <Link href="/records" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">📋</span>
            <span className="text-xs font-medium">{t('common.records')}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">👤</span>
            <span className="text-xs font-medium">{t('common.profile')}</span>
          </Link>
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
      </div>
    </ProtectedRoute>
  );
}
