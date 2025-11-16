'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import CallIntegration from '../../components/CallIntegration';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChat() {
  const { t, language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'hi' 
        ? 'नमस्ते! मैं आपकी स्वास्थ्य सहायक हूँ। आप किसी भी स्वास्थ्य संबंधी सवाल या चिंता के बारे में पूछ सकते हैं।'
        : 'Hello! I am your health assistant. You can ask me any health-related questions or concerns.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('बुखार') || input.includes('fever')) {
      return 'बुखार के लिए सामान्य सुझाव:\n• गर्म नमक-पानी से गरारे करें\n• पर्याप्त आराम करें और पानी पिएं\n• तापमान हर 6-8 घंटे में जांचें\n\nयह सामान्य जानकारी है, चिकित्सकीय सलाह का विकल्प नहीं।\n\nकृपया अपनी उम्र बताएं ताकि मैं बेहतर मार्गदर्शन कर सकूं?';
    }
    
    if (input.includes('गले') || input.includes('throat')) {
      return 'गले में दर्द के लिए:\n• गर्म नमक-पानी से गरारे करें\n• गर्म चाय या शहद लें\n• आवाज को आराम दें\n\nयह वायरल संक्रमण हो सकता है। 24 घंटे में डॉक्टर से मिलें।';
    }
    
    if (input.includes('पेट') || input.includes('stomach')) {
      return 'पेट दर्द के लिए:\n• साफ पानी पिएं\n• हल्का भोजन लें\n• आराम करें\n\nयदि दर्द तेज हो या उल्टी जारी रहे तो तुरंत डॉक्टर से मिलें।';
    }
    
    return 'मैं आपकी समस्या समझ गया हूँ। कृपया अधिक विवरण दें:\n• लक्षण कब से हैं?\n• क्या कोई अन्य समस्या भी है?\n• आपकी उम्र क्या है?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Safe area spacing for mobile status bar */}
      <div className="h-6 bg-white"></div>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-gray-600">
              <span className="text-xl">✕</span>
            </Link>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg">👩‍⚕️</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{t('aiChat.title')}</h1>
              <p className="text-xs text-green-600">{t('aiChat.active')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium"
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </button>
            <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm">🔄</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Date Marker */}
        <div className="flex justify-center">
          <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            })}
          </div>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {!message.isUser && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">👩‍⚕️</span>
                </div>
              )}
              <div className={`rounded-lg px-3 py-2 ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">👩‍⚕️</span>
              </div>
              <div className="bg-gray-200 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('aiChat.enterMessage')}
              className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span className="text-sm">→</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {t('aiChat.aiGenerated')}
        </p>
      </div>

        {/* Call Integration */}
        <div className="px-4 py-3">
          <CallIntegration 
            templateContext={{
              userLocation: 'Baddi, Himachal',
              appVersion: '1.0.0',
              chatHistory: messages.slice(-3).map(m => ({ text: m.text, isUser: m.isUser }))
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setInputText(language === 'hi' ? 'मुझे बुखार है' : 'I have fever')}
              className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium"
            >
              {t('aiChat.checkFever')}
            </button>
            <button 
              onClick={() => setInputText(language === 'hi' ? 'गले में दर्द' : 'Sore throat')}
              className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-medium"
            >
              {t('aiChat.throatPain')}
            </button>
            <button 
              onClick={() => setInputText(language === 'hi' ? 'पेट में दर्द' : 'Stomach pain')}
              className="bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-xs font-medium"
            >
              {t('aiChat.stomachPain')}
            </button>
            <button 
              onClick={() => setInputText(language === 'hi' ? 'डॉक्टर से बात करें' : 'Talk to doctor')}
              className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-xs font-medium"
            >
              {t('aiChat.talkToDoctor')}
            </button>
          </div>
        </div>
    </div>
  );
}
