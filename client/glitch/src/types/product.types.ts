// Tipos para productos
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  sizes: string[];
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sizes: string[];
  images: string[];
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

// Tipos para usuarios
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Tipos para órdenes (Backend con Prisma)
export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  productName: string;
  productImage?: string | null;
}

export interface Order {
  id: number;
  userId: number | null;
  guestEmail: string | null;
  guestName: string | null;
  total: number;
  status: 'PENDING' | 'PAYMENT_PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  mpExternalReference: string | null;
  notes: string | null;
  shippingInfo: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  payment?: {
    id: number;
    amount: number;
    status: string;
    paymentMethod: string | null;
  };
  createdAt: string;
  updatedAt: string;
}
