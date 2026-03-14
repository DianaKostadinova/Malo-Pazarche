export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  size?: string;
  condition: string;
  price: number;
  isAvailable: boolean;
  isBoosted: boolean;
  createdAt: string;
  seller?: User;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
