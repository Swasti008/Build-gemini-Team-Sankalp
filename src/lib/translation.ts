// Translation service using Google Translate API
// Note: This is a client-side implementation. For production, you should use a server-side API.

export type Language = 'en' | 'hi' | 'pa'; // English, Hindi, Punjabi

interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

class TranslationService {
  private apiKey: string;
  private baseUrl = 'https://translation.googleapis.com/language/translate/v2';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY || '';
  }

  async translateText(text: string, targetLanguage: Language): Promise<string> {
    if (!this.apiKey) {
      console.warn('Google Translate API key not found. Returning original text.');
      return text;
    }

    if (!text || text.trim() === '') {
      return text;
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  async translateObject<T extends Record<string, any>>(
    obj: T,
    targetLanguage: Language
  ): Promise<T> {
    const translatedObj = { ...obj };

    for (const key in translatedObj) {
      if (typeof translatedObj[key] === 'string') {
        translatedObj[key] = await this.translateText(translatedObj[key], targetLanguage);
      } else if (typeof translatedObj[key] === 'object' && translatedObj[key] !== null) {
        translatedObj[key] = await this.translateObject(translatedObj[key], targetLanguage);
      }
    }

    return translatedObj;
  }

  getLanguageName(language: Language): string {
    const names = {
      en: 'English',
      hi: 'हिंदी',
      pa: 'ਪੰਜਾਬੀ'
    };
    return names[language];
  }

  getLanguageCode(language: Language): string {
    return language;
  }
}

export const translationService = new TranslationService();

// Common translations for UI elements
export const commonTranslations = {
  en: {
    home: 'Home',
    appointments: 'Appointments',
    records: 'Records',
    profile: 'Profile',
    search: 'Search',
    book: 'Book',
    sync: 'Sync',
    viewDetails: 'View Details',
    videoConsult: 'Video Consult',
    talkToAgent: 'Talk to Agent',
    loading: 'Loading...',
    noData: 'No data available',
    error: 'Error occurred',
    retry: 'Retry',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No'
  },
  hi: {
    home: 'होम',
    appointments: 'अपॉइंटमेंट',
    records: 'रिकॉर्ड',
    profile: 'प्रोफाइल',
    search: 'खोजें',
    book: 'बुक करें',
    sync: 'सिंक',
    viewDetails: 'विवरण देखें',
    videoConsult: 'वीडियो परामर्श',
    talkToAgent: 'एजेंट से बात करें',
    loading: 'लोड हो रहा है...',
    noData: 'कोई डेटा उपलब्ध नहीं',
    error: 'त्रुटि हुई',
    retry: 'पुनः प्रयास',
    close: 'बंद करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    yes: 'हाँ',
    no: 'नहीं'
  },
  pa: {
    home: 'ਘਰ',
    appointments: 'ਮੁਲਾਕਾਤਾਂ',
    records: 'ਰਿਕਾਰਡ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    search: 'ਖੋਜ',
    book: 'ਬੁੱਕ ਕਰੋ',
    sync: 'ਸਿੰਕ',
    viewDetails: 'ਵਿਵਰਣ ਦੇਖੋ',
    videoConsult: 'ਵੀਡੀਓ ਸਲਾਹ',
    talkToAgent: 'ਏਜੰਟ ਨਾਲ ਗੱਲ ਕਰੋ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    noData: 'ਕੋਈ ਡੇਟਾ ਉਪਲਬਧ ਨਹੀਂ',
    error: 'ਗਲਤੀ ਹੋਈ',
    retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼',
    close: 'ਬੰਦ ਕਰੋ',
    save: 'ਸੇਵ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ',
    yes: 'ਹਾਂ',
    no: 'ਨਹੀਂ'
  }
};

// Hook for using translations
export function useTranslation(language: Language) {
  const t = (key: string) => {
    return commonTranslations[language][key as keyof typeof commonTranslations[typeof language]] || key;
  };

  const translateText = async (text: string) => {
    return await translationService.translateText(text, language);
  };

  return { t, translateText };
}







