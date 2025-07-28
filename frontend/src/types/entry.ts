export interface Entry {
  id: number;
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  description?: string;
  imageUrl?: string; // Movie image
  userId?: number; // Associated user
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryInput {
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  description?: string;
}

export interface PaginationResponse {
  data: Entry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}