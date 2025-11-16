'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiClient, UserProfile } from '../../lib/api';

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { user: authUser, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState({
    name: 'User',
    age: 45,
    phone: '+91 98765 43210',
    location: 'Baddi, Himachal',
    emergencyContact: '+91 98765 43211',
    bloodGroup: 'O+',
    allergies: 'None',
    medicalConditions: 'Hypertension'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser?.isAuthenticated && authUser.phoneNumber) {
      loadUserProfile();
    }
  }, [authUser]);

  const loadUserProfile = async () => {
    if (!authUser?.phoneNumber) return;
    
    try {
      setIsLoading(true);
      const profile = await apiClient.getUserProfile(authUser.phoneNumber);
      setUserProfile(profile);
      
      // Update user data with profile information
      setUser(prev => ({
        ...prev,
        name: profile.name || 'User',
        phone: profile.phoneNumber,
      }));
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleInputChange = (field: string, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Safe area spacing for mobile status bar */}
      <div className="h-6 bg-blue-600"></div>
      
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg">{t('profile.title')}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-3 py-1 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-full text-xs font-medium text-blue-900 transition-all"
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </button>
            <button
              onClick={logout}
              className="text-white text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isLoading ? 'Loading...' : user.name}
          </h2>
          <p className="text-gray-600 mb-1">{user.location}</p>
          <p className="text-sm text-gray-500">
            {userProfile?.tickets?.length || 0} consultations • Member since January 2024
          </p>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  value={user.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.age} years</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Medical Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              {isEditing ? (
                <select
                  value={user.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <p className="text-gray-900">{user.bloodGroup}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.allergies}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.medicalConditions}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={user.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.emergencyContact}</p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg"
          >
            Save Changes
          </button>
        )}

        {/* Settings */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🔔</span>
                <span className="font-medium text-gray-900">Notifications</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🌐</span>
                <span className="font-medium text-gray-900">Language</span>
              </div>
              <span className="text-gray-400">English →</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🔒</span>
                <span className="font-medium text-gray-900">Privacy & Security</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-lg">📱</span>
                <span className="font-medium text-gray-900">Offline Mode</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/records"
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium text-blue-800">Health Records</div>
            <div className="text-xs text-blue-600">View medical history</div>
          </Link>
          <Link 
            href="/appointments"
            className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-medium text-green-800">Appointments</div>
            <div className="text-xs text-green-600">Manage bookings</div>
          </Link>
        </div>

        {/* Support */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Need Help?</h3>
          <div className="space-y-2">
            <button className="w-full bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium text-center">
              📞 Contact Support
            </button>
            <button className="w-full bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium text-center">
              📖 User Guide
            </button>
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
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-blue-600">
            <span className="text-lg">👤</span>
            <span className="text-xs">{t('common.profile')}</span>
          </Link>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-20"></div>
      </div>
    </ProtectedRoute>
  );
}
