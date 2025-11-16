'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  nextAvailable: string;
  fee: number;
  image: string;
}

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'General Physician',
    experience: '15 years',
    rating: 4.8,
    nextAvailable: 'Today 2:00 PM',
    fee: 500,
    image: '👨‍⚕️'
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    specialty: 'General Physician',
    experience: '12 years',
    rating: 4.9,
    nextAvailable: 'Tomorrow 10:00 AM',
    fee: 600,
    image: '👩‍⚕️'
  },
  {
    id: '3',
    name: 'Dr. Amit Singh',
    specialty: 'Orthopedist',
    experience: '18 years',
    rating: 4.7,
    nextAvailable: 'Today 4:00 PM',
    fee: 800,
    image: '👨‍⚕️'
  }
];

function BookAppointmentContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const specialty = searchParams.get('specialty') || 'general';
  const condition = searchParams.get('condition') || 'General Consultation';
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentType, setAppointmentType] = useState<'video' | 'physical'>('video');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const availableDates = [
    { date: '2024-01-15', label: 'Today', available: true },
    { date: '2024-01-16', label: 'Tomorrow', available: true },
    { date: '2024-01-17', label: 'Wednesday', available: true },
    { date: '2024-01-18', label: 'Thursday', available: false },
    { date: '2024-01-19', label: 'Friday', available: true }
  ];

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please select doctor, date and time');
      return;
    }
    
    // Here you would integrate with your call system
    alert(`Appointment booked with ${selectedDoctor.name} for ${selectedDate} at ${selectedTime}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Safe area spacing for mobile status bar */}
      <div className="h-6 bg-blue-600"></div>
      
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/consult-doctor" className="text-white">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg">{t('appointment.title')}</h1>
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Condition Info */}
        <div className="bg-white rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-2">Consultation for:</h2>
          <p className="text-blue-600 font-medium">{condition}</p>
          <p className="text-sm text-gray-600 mt-1">Specialty: {specialty}</p>
        </div>

        {/* Appointment Type */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Appointment Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAppointmentType('video')}
              className={`p-3 rounded-lg border-2 ${
                appointmentType === 'video'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <div className="text-2xl mb-2">📹</div>
              <div className="font-medium">Video Consult</div>
              <div className="text-xs text-gray-500">Connect in 5 sec</div>
            </button>
            <button
              onClick={() => setAppointmentType('physical')}
              className={`p-3 rounded-lg border-2 ${
                appointmentType === 'physical'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <div className="text-2xl mb-2">🏥</div>
              <div className="font-medium">Physical Visit</div>
              <div className="text-xs text-gray-500">At Hospital</div>
            </button>
          </div>
        </div>

        {/* Available Doctors */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Available Doctors</h3>
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedDoctor?.id === doctor.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{doctor.image}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        ⭐ {doctor.rating}
                      </span>
                      <span className="text-xs text-gray-500">{doctor.experience}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{doctor.nextAvailable}</p>
                    <p className="text-sm text-gray-600">₹{doctor.fee}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        {selectedDoctor && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Select Date</h3>
            <div className="grid grid-cols-5 gap-2">
              {availableDates.map((date) => (
                <button
                  key={date.date}
                  onClick={() => setSelectedDate(date.date)}
                  disabled={!date.available}
                  className={`p-2 rounded-lg text-xs font-medium ${
                    selectedDate === date.date
                      ? 'bg-blue-500 text-white'
                      : date.available
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div>{date.label}</div>
                  <div className="text-xs opacity-75">
                    {new Date(date.date).getDate()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Selection */}
        {selectedDate && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Select Time</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg text-sm font-medium ${
                    selectedTime === time
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Book Button */}
        {selectedDoctor && selectedDate && selectedTime && (
          <button
            onClick={handleBookAppointment}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg"
          >
            Book Appointment - ₹{selectedDoctor.fee}
          </button>
        )}

        {/* Alternative Options */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Need immediate help?</h3>
          <div className="space-y-2">
            <Link 
              href="/ai-chat"
              className="block bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium text-center"
            >
              🤖 Chat with AI Assistant (Free)
            </Link>
            <Link 
              href="/emergency"
              className="block bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium text-center"
            >
              🚨 Emergency - Call 108
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
          <Link href="/appointments" className="flex flex-col items-center space-y-1 text-blue-600">
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

export default function BookAppointment() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
