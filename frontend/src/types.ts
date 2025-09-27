export interface User {
  _id?: string;
  name: string;
  email: string;
  role?: "admin" | "user";
  token?: string;
}

export interface CategoryDoc {
  _id: string;
  key: string;
  name: string; 
  imageUrl?: string;
  publicId?: string;
  createdAt?: string;
  updatedAt?: string;

  featured?: boolean;
  order?: number;
}

export interface RoomDoc {
  _id: string;
  key: string;
  name: string;
  imageUrl?: string;
  publicId?: string;
  createdAt?: string;
  updatedAt?: string;

  featured?: boolean;
  order?: number;
}

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: number;

  discount?: number;
  stock?: number;
  brand?: string;
  origin?: string;
  weight?: number;
  dimensions?: string;
  material?: string;

  imageUrl?: string;
  publicId?: string;

  category?: CategoryDoc | string;
  room?: RoomDoc | string;

  createdAt?: string;
  updatedAt?: string;

  featured?: boolean;
  order?: number; 
}
