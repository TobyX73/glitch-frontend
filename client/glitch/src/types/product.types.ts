// Tipos para productos
export interface ProductVariant {
  id?: number;
  size: string;
  stock: number;
  sku?: string;
}

export interface ProductImage {
  id?: number;
  url: string;
  order: number;
  isMain: boolean;
  publicId?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;              // ✅ Cambio de price a basePrice
  totalStock: number;             // ✅ Stock total calculado
  images: ProductImage[];         // ✅ Array de objetos con metadata
  mainImage?: string;             // ✅ URL de imagen principal
  variants: ProductVariant[];     // ✅ Variantes con size + stock
  category: {
    id: number;
    name: string;
  };
  categoryId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Retrocompatibilidad temporal
  price?: number;                 // Alias de basePrice
  stock?: number;                 // Alias de totalStock
  sizes?: string[];               // Alias derivado de variants
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
  id: number;
  name: string;
  description?: string;
}

// Tipos para usuarios
export interface User {
  id: number;
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
  size?: string | null;
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
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  payment?: {
    id: number;
    amount: number;
    status: string;
    paymentMethod: string | null;
  };
  createdAt: string;
  updatedAt: string;
}
