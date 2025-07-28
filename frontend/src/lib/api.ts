import type { Entry, CreateEntryInput, PaginationResponse, User } from '@/types/entry';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Entry endpoints
  async getEntries(page = 1, limit = 10): Promise<PaginationResponse> {
    return this.request<PaginationResponse>(`/entries?page=${page}&limit=${limit}`);
  }

  async getEntry(id: number): Promise<Entry> {
    return this.request<Entry>(`/entries/${id}`);
  }

  async createEntry(data: CreateEntryInput & { imageUrl?: string }): Promise<Entry> {
    return this.request<Entry>('/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEntry(id: number, data: Partial<CreateEntryInput> & { imageUrl?: string }): Promise<Entry> {
    return this.request<Entry>(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEntry(id: number): Promise<void> {
    await this.request<void>(`/entries/${id}`, {
      method: 'DELETE',
    });
  }

  // User profile endpoints
  async getProfile(): Promise<User> {
    return this.request<User>('/profile/profile');
  }

  async updateProfile(data: { name?: string; avatarUrl?: string }): Promise<User> {
    return this.request<User>('/profile/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Image upload endpoint
  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();