import Link from 'next/link';

interface Doctor {
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
  education: string[];
  achievements: string[];
  consultationType: 'video' | 'physical' | 'both';
}

const doctors: { [key: string]: Doctor } = {
  '1': {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'General Physician',
    experience: '15 years',
    rating: 4.9,
    reviews: 127,
    nextAvailable: 'Today 2:00 PM',
    fee: 500,
    image: '👨‍⚕️',
    description: 'Experienced general physician with expertise in preventive care and chronic disease management. Dr. Kumar has been serving the Baddi community for over 15 years and is known for his patient-centered approach.',
    languages: ['English', 'Hindi', 'Punjabi'],
    education: ['MBBS - Government Medical College, Patiala', 'MD - General Medicine - PGI Chandigarh'],
    achievements: ['Best General Physician Award 2023', 'Patient Choice Award 2022', 'Community Service Excellence 2021'],
    consultationType: 'both'
  },
  '2': {
    id: '2',
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrician',
    experience: '12 years',
    rating: 4.8,
    reviews: 98,
    nextAvailable: 'Tomorrow 10:00 AM',
    fee: 600,
    image: '👩‍⚕️',
    description: 'Pediatric specialist focused on child health and development. Dr. Sharma has extensive experience in treating children of all ages and is known for her gentle approach with young patients.',
    languages: ['English', 'Hindi'],
    education: ['MBBS - AIIMS Delhi', 'MD - Pediatrics - AIIMS Delhi'],
    achievements: ['Pediatric Excellence Award 2023', 'Child Care Champion 2022'],
    consultationType: 'both'
  }
};

export async function generateStaticParams() {
  return [
    { id: 'rajesh-kumar' },
    { id: 'priya-sharma' },
    { id: 'amit-singh' }
  ];
}

export default function DoctorProfile({ params }: { params: { id: string } }) {
  const doctor = doctors[params.id];

  if (!doctor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">👩‍⚕️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Doctor not found</h2>
          <Link href="/specialists" className="text-indigo-600">← Back to Specialists</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/specialists" className="text-white">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg">Doctor Profile</h1>
          <div className="flex items-center space-x-2">
            <button className="text-white">
              <span className="text-xl">⋯</span>
            </button>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="text-center">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">{doctor.image}</span>
          </div>
          <h2 className="text-2xl font-semibold mb-1">{doctor.name}</h2>
          <p className="text-indigo-100 mb-4">{doctor.specialty}</p>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">💬</span>
            </button>
            <button className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">📞</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* About Doctor */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">About doctor</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{doctor.description}</p>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Reviews {doctor.rating} ({doctor.reviews})</h3>
            <button className="text-indigo-600 text-sm font-medium">See all</button>
          </div>
          
          {/* Sample Reviews */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">Rajesh Kumar</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-sm text-gray-600">5.0</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Dr. Kumar is very professional and understanding. He took time to explain everything clearly.</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">Priya Sharma</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-sm text-gray-600">4.5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Excellent doctor with great bedside manner. Highly recommended!</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
          <div className="flex items-start space-x-3">
            <span className="text-gray-500">📍</span>
            <div>
              <p className="font-medium text-gray-900">Baddi Civil Hospital</p>
              <p className="text-sm text-gray-600">Civil Hospital Road, Baddi, Himachal 147301</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-gray-500">📍 0.5 km away</span>
                <button className="text-indigo-600 text-sm font-medium">Get Directions</button>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Price */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Consultation price</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{doctor.fee}</p>
              <p className="text-sm text-gray-600">Per consultation</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Available: {doctor.nextAvailable}</p>
              <p className="text-xs text-gray-500">Languages: {doctor.languages.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Education & Experience</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Education</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {doctor.education.map((edu, index) => (
                  <li key={index}>• {edu}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
              <p className="text-sm text-gray-600">{doctor.experience} of experience</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Achievements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {doctor.achievements.map((achievement, index) => (
                  <li key={index}>🏆 {achievement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Book Appointment Button */}
        <Link
          href={`/book-appointment?doctor=${doctor.id}`}
          className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg text-center"
        >
          Book Appointment - ₹{doctor.fee}
        </Link>

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
