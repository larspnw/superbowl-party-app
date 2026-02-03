export interface Category {
  id: string;
  name: string;
  max_items: number;
  cards: Card[];
}

export interface Card {
  id: string;
  couple_name: string;
  dish_name: string;
  dietary_restrictions: string;
  category_id: string;
  created_at: string;
}

export interface CardData {
  couple_name: string;
  dish_name: string;
  dietary_restrictions: string;
  category_id: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface AppState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  backendReady: boolean;
}