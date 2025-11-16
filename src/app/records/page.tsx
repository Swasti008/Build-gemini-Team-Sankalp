'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import VideoConsultationLoader from '../../components/VideoConsultationLoader';
import TicketDetailsModal from '../../components/TicketDetailsModal';
import { apiClient, Ticket, Summary } from '../../lib/api';

interface HealthRecord {
  id: string;
  date: string;
  type: 'consultation' | 'lab_test' | 'prescription' | 'vaccination';
  title: string;
  doctor: string;
  description: string;
  status: 'completed' | 'pending' | 'scheduled';
  isOffline: boolean;
}

// Function to translate API content based on language
const translateApiContent = (content: string, language: string): string => {
  if (language === 'en') return content;
  
  // Simple content translation mapping
  const translations: { [key: string]: { [lang: string]: string } } = {
    'fever and throat pain': {
      'hi': 'बुखार और गले में दर्द',
      'pa': 'ਬੁਖਾਰ ਅਤੇ ਗਲੇ ਦਾ ਦਰਦ'
    },
    'consult a doctor online': {
      'hi': 'ऑनलाइन डॉक्टर से परामर्श करें',
      'pa': 'ਔਨਲਾਈਨ ਡਾਕਟਰ ਤੋਂ ਸਲਾਹ ਲਓ'
    },
    'reported having': {
      'hi': 'ने शिकायत की',
      'pa': 'ਨੇ ਸ਼ਿਕਾਇਤ ਕੀਤੀ'
    },
    'was advised to': {
      'hi': 'को सलाह दी गई',
      'pa': 'ਨੂੰ ਸਲਾਹ ਦਿੱਤੀ ਗਈ'
    },
    'near Chitkara University, Baddi': {
      'hi': 'चितकारा यूनिवर्सिटी, बड्डी के पास',
      'pa': 'ਚਿਤਕਾਰਾ ਯੂਨੀਵਰਸਿਟੀ, ਬੱਡੀ ਦੇ ਨੇੜੇ'
    },
    'a user': {
      'hi': 'एक उपयोगकर्ता',
      'pa': 'ਇੱਕ ਯੂਜਰ'
    }
  };
  
  let translatedContent = content;
  Object.keys(translations).forEach(key => {
    if (translations[key][language]) {
      translatedContent = translatedContent.replace(new RegExp(key, 'gi'), translations[key][language]);
    }
  });
  
  return translatedContent;
};

// Function to create sample records with translated descriptions
const createSampleRecords = (t: (key: string) => string): HealthRecord[] => [
  {
    id: '1',
    date: '2024-01-15',
    type: 'consultation',
    title: t('common.generalHealthCheckup'),
    doctor: 'Dr. Rajesh Kumar',
    description: t('common.routineCheckupDescription'),
    status: 'completed',
    isOffline: true
  },
  {
    id: '2',
    date: '2024-01-10',
    type: 'lab_test',
    title: t('common.bloodSugarTest'),
    doctor: 'Dr. Priya Sharma',
    description: t('common.bloodSugarDescription'),
    status: 'completed',
    isOffline: true
  },
  {
    id: '3',
    date: '2024-01-08',
    type: 'prescription',
    title: t('common.medicationForFever'),
    doctor: 'Dr. Amit Singh',
    description: t('common.medicationDescription'),
    status: 'completed',
    isOffline: true
  },
  {
    id: '4',
    date: '2024-01-20',
    type: 'consultation',
    title: t('common.followUpAppointment'),
    doctor: 'Dr. Rajesh Kumar',
    description: t('common.followUpDescription'),
    status: 'scheduled',
    isOffline: false
  }
];

export default function HealthRecords() {
  const { t, language, setLanguage, cycleLanguage } = useLanguage();
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoLoader, setShowVideoLoader] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (user?.isAuthenticated && user.phoneNumber) {
      loadUserTickets();
    }
  }, [user, language]);

  const loadUserTickets = async () => {
    if (!user?.phoneNumber) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching tickets for phone:', user.phoneNumber);
      const userTickets = await apiClient.getUserTickets(user.phoneNumber);
      console.log('Fetched tickets:', userTickets);
      setTickets(userTickets);
      
      // Convert tickets to health records format
      const healthRecords: HealthRecord[] = userTickets.flatMap(ticket => {
        const records: HealthRecord[] = [];
        
        // Add main consultation record for each ticket
        records.push({
          id: ticket._id,
          date: ticket.createdAt || new Date().toISOString(),
          type: 'consultation',
          title: `${t('common.consultation')} - ${ticket.name || 'Unknown Patient'}`,
          doctor: 'AI Assistant',
          description: ticket.summaries?.[0]?.aiAnalysis?.shortSummary 
            ? translateApiContent(ticket.summaries[0].aiAnalysis.shortSummary, language)
            : t('common.consultationDescription'),
          status: ticket.isActive ? 'scheduled' : 'completed',
          isOffline: !isOnline
        });

        // Add individual summary records for each summary
        ticket.summaries?.forEach((summary, index) => {
          if (summary.aiAnalysis?.shortSummary) {
            records.push({
              id: `${ticket._id}-summary-${index}`,
              date: ticket.createdAt || new Date().toISOString(),
              type: 'consultation',
              title: `${t('common.aiAnalysis')} - ${ticket.name || 'Unknown Patient'}`,
              doctor: 'AI Assistant',
              description: summary.aiAnalysis.shortSummary 
                ? translateApiContent(summary.aiAnalysis.shortSummary, language)
                : t('common.consultationDescription'),
              status: 'completed',
              isOffline: !isOnline
            });
          }
        });

        // Add prescription records
        ticket.prescriptions?.forEach((prescription, index) => {
          records.push({
            id: `${ticket._id}-prescription-${index}`,
            date: ticket.createdAt || new Date().toISOString(),
            type: 'prescription',
            title: t('common.prescription'),
            doctor: prescription.prescribedBy || 'Unknown Doctor',
            description: prescription.prescription 
              ? translateApiContent(prescription.prescription, language)
              : t('common.medicationDescription'),
            status: 'completed',
            isOffline: !isOnline
          });
        });

        return records;
      });

      console.log('Converted health records:', healthRecords);
      setRecords(healthRecords);
    } catch (error) {
      console.error('Failed to load user tickets:', error);
      // Use translated sample records as fallback
      const sampleRecords = createSampleRecords(t);
      setRecords(sampleRecords);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoConsultation = (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowVideoLoader(true);
  };

  const handleVideoLoaderComplete = () => {
    setShowVideoLoader(false);
    setSelectedRoomId('');
  };

  const handleTicketClick = (ticketId: string) => {
    const ticket = tickets.find(t => t._id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setShowTicketModal(true);
    }
  };

  const handleSync = async () => {
    if (!user?.phoneNumber) return;
    
    try {
      setIsSyncing(true);
      await loadUserTickets();
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredRecords = records.filter(record => 
    selectedType === 'all' || record.type === selectedType
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return '🩺';
      case 'lab_test': return '🧪';
      case 'prescription': return '💊';
      case 'vaccination': return '💉';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const syncRecords = async () => {
    if (!isOnline) {
      alert('You are offline. Records will sync when connection is restored.');
      return;
    }

    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Records synced successfully!');
    } catch (error) {
      alert('Sync failed. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      {showVideoLoader && (
        <VideoConsultationLoader 
          roomId={selectedRoomId} 
          onComplete={handleVideoLoaderComplete} 
        />
      )}
      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={showTicketModal}
        onClose={() => {
          setShowTicketModal(false);
          setSelectedTicket(null);
        }}
      />
      <div className="min-h-screen bg-gray-50">
      {/* Safe area spacing for mobile status bar */}
      <div className="h-6 bg-blue-600"></div>
      
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white">
            <span className="text-xl">←</span>
          </Link>
          <h1 className="font-semibold text-lg">{t('records.title')}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={cycleLanguage}
              className="px-3 py-1 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-full text-xs font-medium text-blue-900 transition-all"
            >
              {language === 'en' ? 'EN' : language === 'hi' ? 'हिं' : 'ਪੰ'}
            </button>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="text-white text-sm font-medium disabled:opacity-50"
            >
              {isSyncing ? '🔄 Syncing...' : isOnline ? `🔄 ${t('common.sync')}` : t('common.offline')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Connection Status */}
        <div className={`rounded-lg p-3 ${
          isOnline 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{isOnline ? '🟢' : '🟡'}</span>
            <div>
              <p className={`font-medium ${
                isOnline ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {isOnline ? t('common.online') : t('common.offlineMode')}
              </p>
              <p className={`text-sm ${
                isOnline ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {isOnline 
                  ? t('common.allRecordsSynced')
                  : 'Viewing cached records. Changes will sync when online.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        {/* <div className="bg-white rounded-xl p-2 shadow-sm">
          <div className="flex space-x-1 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All Records' },
              { key: 'consultation', label: 'Consultations' },
              { key: 'lab_test', label: 'Lab Tests' },
              { key: 'prescription', label: 'Prescriptions' },
              { key: 'vaccination', label: 'Vaccinations' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedType(tab.key)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedType === tab.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div> */}

        {/* Records List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loadingRecords')}</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="space-y-3">
              {/* Group records by ticket */}
              {tickets.map((ticket) => {
                const ticketRecords = filteredRecords.filter(record => 
                  record.id === ticket._id || record.id.startsWith(ticket._id)
                );
                
                if (ticketRecords.length === 0) return null;
                
                return (
                  <div key={ticket._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    {/* Ticket Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{ticket.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{ticket.phoneNumber}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ticket.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ticket.isActive ? t('common.active') : 'Inactive'}
                          </span>
                          <button
                            onClick={() => handleTicketClick(ticket._id)}
                            className="text-blue-600 text-sm font-medium hover:text-blue-800 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            {t('common.viewAllDetails')}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Records for this ticket */}
                    <div className="p-6 space-y-4">
                      {ticketRecords.map((record) => (
                        <div key={record.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                          {/* Data Section - Top */}
                          <div className="p-6">
                            <h4 className="font-semibold text-gray-900 text-lg mb-3">
                              {record.type === 'consultation' ? t('common.consultation') : 
                               record.type === 'prescription' ? t('common.prescription') : 
                               record.type === 'lab_test' ? t('common.labTest') : 
                               record.type === 'vaccination' ? t('common.vaccination') : 
                               t('common.aiAnalysis')} - {ticket.name}
                            </h4>
                            <p className="text-gray-700 text-base leading-relaxed mb-4">
                              {record.description}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>👨‍⚕️ {record.doctor}</span>
                              <span>📅 {new Date(record.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          {/* Action Buttons - Bottom */}
                          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                              {record.status === 'completed' ? t('common.completed') : 
                               record.status === 'scheduled' ? t('common.scheduled') : 
                               record.status}
                            </span>
                            {record.type === 'consultation' && (
                              <button
                                onClick={() => handleVideoConsultation(record.id.includes('-summary') ? record.id.split('-summary')[0] : record.id)}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                              >
                                {t('common.video')}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('common.noRecordsFound')}</h3>
              <p className="text-sm text-gray-600">
                {selectedType === 'all' 
                  ? t('common.noHealthRecordsYet')
                  : t('common.noRecordsOfType').replace('{type}', selectedType)
                }
              </p>
            </div>
          )}
        </div>

        {/* Add New Record */}
        <div className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-200 shadow-sm">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">➕</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">{t('common.addNewRecord')}</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              {t('common.uploadDocumentNote')}
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <button className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                {t('common.uploadDocument')}
              </button>
              <button className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                {t('common.addNote')}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/appointments"
            className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center hover:bg-blue-100 transition-colors shadow-sm"
          >
            <div className="text-3xl mb-3">📅</div>
            <div className="text-sm font-semibold text-blue-800 mb-1">{t('common.appointments')}</div>
            <div className="text-xs text-blue-600">{t('common.viewUpcoming')}</div>
          </Link>
          <Link 
            href="/pharmacy"
            className="bg-green-50 border border-green-200 rounded-xl p-5 text-center hover:bg-green-100 transition-colors shadow-sm"
          >
            <div className="text-3xl mb-3">💊</div>
            <div className="text-sm font-semibold text-green-800 mb-1">{t('home.medicines')}</div>
            <div className="text-xs text-green-600">{t('common.checkAvailability')}</div>
          </Link>
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-yellow-600 text-lg">⚠️</span>
              <div>
                <h4 className="font-semibold text-yellow-800">{t('common.offlineMode')}</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  {t('common.offlineModeDescription')}
                </p>
              </div>
            </div>
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
          <Link href="/appointments" className="flex flex-col items-center space-y-1 text-gray-400">
            <span className="text-lg">📅</span>
            <span className="text-xs">{t('common.appointments')}</span>
          </Link>
          <Link href="/records" className="flex flex-col items-center space-y-1 text-blue-600">
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
      <div className="h-16"></div>
      </div>
    </ProtectedRoute>
  );
}
