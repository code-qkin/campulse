// src/types.ts

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'Textbooks' | 'Dorm Essentials' | 'Electronics' | 'Services' | 'Other';
  images: string[];   
  sellerId: string;    
  university: string; 
  condition: 'New' | 'Used - Like New' | 'Used - Fair';
  createdAt: number;   
  isSold: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  university: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
}