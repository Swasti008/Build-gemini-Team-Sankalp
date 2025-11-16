'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

interface LabTest {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  fastingRequired: boolean;
  category: string;
}

const labTests: LabTest[] = [
  {
    id: '1',
    name: 'Complete Blood Count (CBC)',
    description: 'Basic blood test to check overall health',
    price: 300,
    duration: 'Same day',
    fastingRequired: false,
    category: 'Basic'
  },
  {
    id: '2',
    name: 'Blood Sugar (Fasting)',
    description: 'Test for diabetes and blood sugar levels',
    price: 150,
    duration: 'Same day',
    fastingRequired: true,
    category: 'Diabetes'
  },
  {
    id: '3',
    name: 'Lipid Profile',
    description: 'Check cholesterol and heart health',
    price: 400,
    duration: 'Same day',
    fastingRequired: true,
    category: 'Heart'
  },
  {
    id: '4',
    name: 'Thyroid Function Test',
    description: 'Check thyroid hormone levels',
    price: 500,
    duration: 'Next day',
    fastingRequired: false,
    category: 'Hormone'
  },
  {
    id: '5',
    name: 'Liver Function Test',
    description: 'Check liver health and function',
    price: 600,
    duration: 'Same day',
    fastingRequired: true,
    category: 'Liver'
  },
  {
    id: '6',
    name: 'Kidney Function Test',
    description: 'Check kidney health and function',
    price: 450,
    duration: 'Same day',
    fastingRequired: false,
    category: 'Kidney'
  }
];

export default function LabTests() {
  const { t, language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<string[]>([]);

  const categories = ['All', 'Basic', 'Diabetes', 'Heart', 'Hormone', 'Liver', 'Kidney'];

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (testId: string) => {
    setCart(prev => [...prev, testId]);
  };

  const removeFromCart = (testId: string) => {
    setCart(prev => prev.filter(id => id !== testId));
  };

  const totalPrice = cart.reduce((total, testId) => {
    const test = labTests.find(t => t.id === testId);
    return total + (test?.price || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-gray-600">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg text-gray-900">{t('home.labTests')}</h1>
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
            placeholder="Search for lab tests..."
            className="w-full px-4 py-3 pl-12 bg-gray-50 text-gray-900 rounded-xl text-sm placeholder-gray-500 border-0 focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>

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

        {/* Popular Tests */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Popular Health Packages</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-indigo-100">
              <h4 className="font-medium text-sm text-gray-900">Basic Health Check</h4>
              <p className="text-xs text-gray-600 mt-1">CBC + Blood Sugar</p>
              <p className="text-sm font-semibold text-indigo-600 mt-2">₹399</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-indigo-100">
              <h4 className="font-medium text-sm text-gray-900">Complete Health Check</h4>
              <p className="text-xs text-gray-600 mt-1">All basic tests</p>
              <p className="text-sm font-semibold text-indigo-600 mt-2">₹1299</p>
            </div>
          </div>
        </div>

        {/* Lab Tests List */}
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <div key={test.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-500">⏱️ {test.duration}</span>
                    {test.fastingRequired && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Fasting Required
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{test.price}</p>
                  <span className="text-xs text-gray-500">{test.category}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">🏠</span>
                  <span className="text-sm text-gray-700">Home collection available</span>
                </div>
                <button
                  onClick={() => cart.includes(test.id) ? removeFromCart(test.id) : addToCart(test.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    cart.includes(test.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {cart.includes(test.id) ? 'Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Home Collection Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🏠</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Home Collection Available</h3>
              <p className="text-sm text-green-700 mt-1">Free sample collection at your doorstep</p>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="bg-indigo-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Cart ({cart.length} tests)</h3>
              <p className="font-semibold">₹{totalPrice}</p>
            </div>
            <button className="w-full bg-white text-indigo-600 py-3 rounded-lg font-semibold">
              Book Lab Tests
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/ai-chat" className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-medium text-blue-800">AI Assistant</div>
            <div className="text-xs text-blue-600">Test recommendations</div>
          </Link>
          <Link href="/book-appointment" className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">👩‍⚕️</div>
            <div className="text-sm font-medium text-green-800">Consult Doctor</div>
            <div className="text-xs text-green-600">Get prescription</div>
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
