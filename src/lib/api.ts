const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sih-2025-fc4t.onrender.com/api';

export interface Ticket {
  _id: string;
  phoneNumber: string;
  name?: string;
  gender?: string;
  summaries?: Summary[];
  prescriptions?: Prescription[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Summary {
  id: string;
  aiAnalysis?: {
    shortSummary?: string;
    detailedSummary?: string;
    transcript?: string;
  };
  prescription?: {
    text?: string;
    prescribedBy?: string;
  };
}

export interface Prescription {
  prescription: string;
  prescribedBy: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  location_area: string;
  inventory: Medicine[];
}

export interface Medicine {
  medicine_id: string;
  name: string;
  category: string;
  requires_prescription: boolean;
  status: 'in stock' | 'out of stock';
}

export interface UserProfile {
  phoneNumber: string;
  name?: string;
  gender?: string;
  tickets: Ticket[];
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User-related API calls
  async getUserTickets(phoneNumber: string): Promise<Ticket[]> {
    return this.request<Ticket[]>('/tickets/by-phone', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async getUserProfile(phoneNumber: string): Promise<UserProfile> {
    const tickets = await this.getUserTickets(phoneNumber);
    return {
      phoneNumber,
      name: tickets[0]?.name || 'User',
      gender: tickets[0]?.gender,
      tickets,
    };
  }

  // Pharmacy-related API calls
  async getAllPharmacies(): Promise<Pharmacy[]> {
    // This would need to be implemented in the backend
    // For now, return mock data
    return [
      {
        id: '1',
        name: 'Baddi Medical Store',
        address: 'Near Civil Hospital, Baddi',
        phone_number: '+91 98765 43210',
        location_area: 'Baddi',
        inventory: []
      },
      {
        id: '2',
        name: 'Baddi Pharmacy',
        address: 'Main Market, Baddi',
        phone_number: '+91 98765 43211',
        location_area: 'Baddi',
        inventory: []
      }
    ];
  }

  async getPharmacyInventory(pharmacyId: string): Promise<Medicine[]> {
    return this.request<{ inventory: Medicine[] }>(`/inventory?pharmacy_id=${pharmacyId}`)
      .then(response => response.inventory);
  }

  async searchMedicineInPharmacies(medicineName: string): Promise<{ pharmacy: Pharmacy; medicines: Medicine[] }[]> {
    // This would need to be implemented in the backend
    // For now, return mock data
    const pharmacies = await this.getAllPharmacies();
    const results: { pharmacy: Pharmacy; medicines: Medicine[] }[] = [];

    for (const pharmacy of pharmacies) {
      try {
        const inventory = await this.getPharmacyInventory(pharmacy.id);
        const matchingMedicines = inventory.filter(medicine =>
          medicine.name.toLowerCase().includes(medicineName.toLowerCase())
        );
        
        if (matchingMedicines.length > 0) {
          results.push({
            pharmacy,
            medicines: matchingMedicines
          });
        }
      } catch (error) {
        console.error(`Failed to fetch inventory for pharmacy ${pharmacy.id}:`, error);
      }
    }

    return results;
  }

  // OTP-related API calls
  async sendOtp(phoneNumber: string): Promise<{ status: string; to: string }> {
    return this.request<{ status: string; to: string }>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<{
    verified: boolean;
    isActive: boolean;
    prescriptions: string[];
  }> {
    return this.request<{
      verified: boolean;
      isActive: boolean;
      prescriptions: string[];
    }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, code }),
    });
  }

  // Call-related API calls
  async makeCall(phoneNumber: string, templateContext?: Record<string, any>): Promise<{
    success: boolean;
    message: string;
    error?: string;
  }> {
    return this.request<{
      success: boolean;
      message: string;
      error?: string;
    }>('/call', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, templateContext }),
    });
  }
}

export const apiClient = new ApiClient();
