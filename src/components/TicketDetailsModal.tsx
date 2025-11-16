'use client';

import { useState } from 'react';
import { Ticket, Summary } from '../lib/api';

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TicketDetailsModal({ ticket, isOpen, onClose }: TicketDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'prescriptions'>('summary');

  if (!isOpen || !ticket) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status: boolean) => {
    return status ? 'Active' : 'Inactive';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Ticket Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Ticket Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Patient Name</label>
                <p className="text-lg font-semibold text-gray-900">{ticket.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="text-lg font-semibold text-gray-900">{ticket.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-lg font-semibold text-gray-900 capitalize">{ticket.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(ticket.isActive)}`}>
                  {getStatusText(ticket.isActive)}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-sm text-gray-900">{formatDate(ticket.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Updated</label>
                <p className="text-sm text-gray-900">{formatDate(ticket.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'summary'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              AI Analysis ({ticket.summaries?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'prescriptions'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Prescriptions ({ticket.prescriptions?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              {ticket.summaries && ticket.summaries.length > 0 ? (
                ticket.summaries.map((summary, index) => (
                  <div key={summary.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Analysis #{index + 1}</h3>
                      <span className="text-xs text-gray-500">ID: {summary.id}</span>
                    </div>
                    
                    {summary.aiAnalysis && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Short Summary</label>
                          <p className="text-gray-900 mt-1">{summary.aiAnalysis.shortSummary}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Detailed Summary</label>
                          <p className="text-gray-900 mt-1 text-sm leading-relaxed">
                            {summary.aiAnalysis.detailedSummary}
                          </p>
                        </div>
                        
                        {summary.aiAnalysis.transcript && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Transcript</label>
                            <div className="bg-gray-50 rounded-lg p-3 mt-1 max-h-40 overflow-y-auto">
                              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                {summary.aiAnalysis.transcript}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No AI analysis available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              {ticket.prescriptions && ticket.prescriptions.length > 0 ? (
                ticket.prescriptions.map((prescription, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Prescription #{index + 1}</h3>
                      {prescription.prescribedBy && (
                        <span className="text-sm text-gray-600">By: {prescription.prescribedBy}</span>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {prescription.prescription}
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💊</div>
                  <p>No prescriptions available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}







