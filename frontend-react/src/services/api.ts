import axios from 'axios';
import { Category, Card, CardData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://superbowl-party-api.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.message);
    
    if (error.response?.status === 503) {
      throw new Error('Backend is starting up. Please wait a moment and refresh.');
    } else if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to backend. Please ensure it is deployed.');
    }
    
    throw error;
  }
);

export const apiService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async createCard(cardData: CardData): Promise<Card> {
    const response = await api.post<Card>('/cards', cardData);
    return response.data;
  },

  async updateCardCategory(cardId: string, categoryId: string): Promise<Card> {
    const response = await api.put<Card>(`/cards/${cardId}/category`, {
      category_id: categoryId
    });
    return response.data;
  },

  async updateCard(cardId: string, updates: Partial<CardData>): Promise<Card> {
    const response = await api.put<Card>(`/cards/${cardId}`, updates);
    return response.data;
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
};