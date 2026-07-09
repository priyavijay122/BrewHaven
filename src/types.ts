export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  ingredients: string[];
  region: string;
  roast: 'Light' | 'Medium' | 'Medium Dark' | 'Dark';
}

export interface CartItem {
  product: MenuItem;
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinedDate: string;
}

export interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'Delivered' | 'In Progress' | 'Cancelled';
  timestamp?: number;
  deliveryMinutes?: number;
}
