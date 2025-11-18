import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User 
} from '../types/auth.types';

const API_BASE_URL = 'https://glitch-backend-uu8n.onrender.com/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // NO usar withCredentials si el backend no está configurado para ello
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Error de red (backend apagado, sin internet, CORS, etc)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Error de red. El backend puede estar hibernado o hay un problema de conexión.');
      return Promise.reject({
        message: 'No se puede conectar con el servidor. Por favor, intenta de nuevo en unos segundos.',
        isNetworkError: true,
        originalError: error
      });
    }

    // Error 401 - Token expirado o inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Solo redirigir si no estamos ya en login o register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


export const authAPI = {
  // Registro de usuario
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', data);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    return response.data;
  },

  // Obtener perfil del usuario autenticado
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/users/profile', data);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.patch('/users/change-password', { oldPassword, newPassword });
  },

  // Eliminar cuenta
  deleteAccount: async (): Promise<void> => {
    await api.delete('/users/account');
  },
};


export const usersAPI = {
  // Obtener todos los usuarios (solo admin)
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // Obtener usuario por ID (solo admin)
  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Eliminar usuario por ID (solo admin)
  deleteById: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Actualizar rol de usuario (solo admin)
  updateRole: async (id: string, role: 'user' | 'admin'): Promise<User> => {
    const response = await api.put<User>(`/users/${id}/role`, { role });
    return response.data;
  },
};


export const uploadsAPI = {
  // Subir imagen a Cloudinary
  uploadImage: async (imageFile: File): Promise<{ url: string; publicId: string; width: number; height: number; format: string }> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post<{ data: { url: string; publicId: string; width: number; height: number; format: string } }>('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};


// Importar tipos desde product.types.ts en lugar de duplicar
import type { Product } from '../types/product.types';

export const productsAPI = {
  // Obtener todos los productos
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<{ success: boolean; data: Product[]; pagination?: any }>('/products');
    return response.data.data;
  },

  // Obtener producto por ID
  getById: async (id: string | number): Promise<Product> => {
    const response = await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
    return response.data.data;
  },

  // Crear producto con imágenes (FormData) (admin)
  createWithImages: async (formData: FormData): Promise<Product> => {
    const response = await api.post<Product>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Crear producto sin imágenes (JSON) (admin)
  create: async (data: any): Promise<Product> => {
    const response = await api.post<{ success: boolean; data: Product }>('/products', data);
    return response.data.data;
  },

  // Actualizar producto (admin)
  update: async (id: string, data: any): Promise<Product> => {
    const response = await api.put<{ success: boolean; data: Product }>(`/products/${id}`, data);
    return response.data.data;
  },

  // Actualizar stock (admin)
  updateStock: async (id: string, stock: number): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}/stock`, { stock });
    return response.data;
  },

  // Eliminar producto (admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};


export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const categoriesAPI = {
  // Obtener todas las categorías
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data.data;
  },

  // Obtener categoría por ID
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<{ success: boolean; data: Category }>(`/categories/${id}`);
    return response.data.data;
  },

  // Crear categoría (admin)
  create: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    const response = await api.post<{ success: boolean; data: Category }>('/categories', data);
    return response.data.data;
  },

  // Actualizar categoría (admin)
  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  // Eliminar categoría (admin)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};


export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  size?: string;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PAYMENT_PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  shippingAddress?: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface shippingAddress {
  address: string;
  apartment?: string;
  city: string;
  zipCode: string;
  type: 'domicilio' | 'sucursal';
  cost: number;
  estimatedDays: number;
  postalCode?: string;
  province?: string;
};


export interface CheckoutData {
  items: OrderItem[];
  shippingAddress: shippingAddress;
  paymentMethod?: string;
}

export const ordersAPI = {
  // Crear orden desde carrito (público)
  checkout: async (data: CheckoutData): Promise<Order> => {
    const response = await api.post<Order>('/orders/checkout', data);
    return response.data;
  },

  // Checkout completo + preferencia MercadoPago (público)
  checkoutComplete: async (data: CheckoutData): Promise<any> => {
    const response = await api.post('/orders/checkout-complete', data);
    return response.data;
  },

  // Test checkout sin validaciones (público)
  testCheckout: async (data: CheckoutData): Promise<Order> => {
    const response = await api.post<Order>('/orders/test-checkout', data);
    return response.data;
  },

  // Verificar stock del carrito (público)
  verifyCart: async (items: OrderItem[]): Promise<any> => {
    const response = await api.post('/orders/verify-cart', { items });
    return response.data;
  },

  // Ver orden específica (público para tracking)
  getById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Crear preferencia de pago MercadoPago
  createPayment: async (orderId: number): Promise<any> => {
    const response = await api.post(`/orders/${orderId}/create-payment`);
    return response.data;
  },

  // Obtener órdenes del usuario autenticado (requiere auth)
  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders/user/my-orders');
    return response.data;
  },

  // Obtener todas las órdenes (solo admin)
  getAll: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  // Actualizar estado de orden (solo admin)
  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },
};


export interface DeliveryQuote {
  carrier: string;
  price: number;
  estimatedDays: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  provincia: string;
}

export const deliveryAPI = {
  // Calcular costo de envío usando endpoint /quote
  calculateShipping: async (data: {
    postalCode: string;
    items: { productId: number; quantity: number; categoryId?: number }[];
  }): Promise<{ cost: number; estimatedDays: string; carrier: string }> => {
    console.log('🔥 API.TS - Enviando:', JSON.stringify(data, null, 2));
    
    const response = await api.post<{ 
      success: boolean; 
      data: { 
        postalCode: string;
        packaging: any;
        options: {
          domicilio?: { precio: number; tiempoEntrega: number; servicio: string };
          sucursal?: { precio: number; tiempoEntrega: number; servicio: string };
        };
        rawApiResponse: any;
      } 
    }>('/delivery/quote', data);
    
    console.log('🔥 API.TS - Respuesta completa:', response.data);
    
    // Extraer la opción a domicilio por defecto
    const deliveryData = response.data.data;
    
    console.log('🔥 deliveryData:', deliveryData);
    console.log('🔥 deliveryData.options:', deliveryData.options);
    console.log('🔥 deliveryData.rawApiResponse:', deliveryData.rawApiResponse);
    
    // Intentar primero con options (estructura esperada)
    let option = deliveryData.options?.domicilio || deliveryData.options?.sucursal;
    
    // Si options está vacío, extraer directamente de rawApiResponse
    if (!option && deliveryData.rawApiResponse) {
      const raw = deliveryData.rawApiResponse;
      // Buscar en paqarClasico o pagoClasico (typo en backend)
      const clasico = raw.paqarClasico || raw.pagoClasico;
      
      if (clasico) {
        const precio = clasico.aDomicilio || clasico.aSucursal;
        if (precio) {
          option = {
            precio: precio,
            tiempoEntrega: 5, // Valor por defecto
            servicio: 'Correo Argentino'
          };
          console.log('🔥 Opción extraída de rawApiResponse:', option);
        }
      }
    }
    
    if (!option) {
      console.error('No hay opciones disponibles:', deliveryData);
      console.error('Estructura completa:', JSON.stringify(deliveryData, null, 2));
      throw new Error('No hay opciones de envío disponibles');
    }
    
    const result = {
      cost: option.precio,
      estimatedDays: `${option.tiempoEntrega} días hábiles`,
      carrier: option.servicio
    };
    
    console.log('🔥 API.TS - Resultado formateado:', result);
    return result;
  },

  // Calcular envío con ambas opciones (domicilio y sucursal)
  calculateShippingWithOptions: async (data: {
    postalCode: string;
    items: { productId: number; quantity: number; categoryId?: number }[];
  }): Promise<{
    domicilio?: { type: 'domicilio'; price: number; days: number };
    sucursal?: { type: 'sucursal'; price: number; days: number };
  }> => {
    const response = await api.post<{ 
      success: boolean; 
      data: { 
        postalCode: string;
        packaging: any;
        options: {
          domicilio?: { precio: number; tiempoEntrega: number; servicio: string };
          sucursal?: { precio: number; tiempoEntrega: number; servicio: string };
        };
        rawApiResponse: any;
      } 
    }>('/delivery/quote', data);
    
    const deliveryData = response.data.data;
    const raw = deliveryData.rawApiResponse;
    const clasico = raw?.paqarClasico || raw?.pagoClasico;
    
    const result: any = {};
    
    if (clasico?.aDomicilio) {
      result.domicilio = {
        type: 'domicilio' as const,
        price: clasico.aDomicilio,
        days: 5
      };
    }
    
    if (clasico?.aSucursal) {
      result.sucursal = {
        type: 'sucursal' as const,
        price: clasico.aSucursal,
        days: 3
      };
    }
    
    return result;
  },

  // Obtener sucursales cercanas por provincia
  getBranches: async (provincia: string): Promise<Array<{
    nombre: string;
    direccion: string;
    localidad: string;
  }>> => {
    try {
      const response = await api.get<{
        success: boolean;
        data: {
          sucursales: Array<{
            nombre: string;
            direccion: string;
            localidad: string;
            provincia: string;
          }>;
        };
      }>(`/delivery/branches/${encodeURIComponent(provincia)}`);
      
      return response.data.data?.sucursales || [];
    } catch (error) {
      console.error('Error obteniendo sucursales:', error);
      return [];
    }
  },

  // Calcular precio de envío por dimensiones físicas
  calculatePrice: async (data: {
    cpDestino: string;
    peso: string;
    alto?: string;
    ancho?: string;
    largo?: string;
  }): Promise<any> => {
    const response = await api.post('/delivery/calculate-price', data);
    return response.data;
  },

  // Obtener sucursales por provincia
  getBranches: async (provincia?: string): Promise<Branch[]> => {
    const url = provincia ? `/delivery/branches/${provincia}` : '/delivery/branches';
    const response = await api.get<Branch[]>(url);
    return response.data;
  },

  // Test de packaging
  testPackaging: async (data: any): Promise<any> => {
    const response = await api.post('/delivery/test/packaging', data);
    return response.data;
  },

  // Estadísticas de cache
  getCacheStats: async (): Promise<any> => {
    const response = await api.get('/delivery/stats/cache');
    return response.data;
  },

  // Limpiar cache
  clearCache: async (): Promise<void> => {
    await api.post('/delivery/cache/clear');
  },

  // Test de configuración RapidAPI
  testRapidAPIConfig: async (): Promise<any> => {
    const response = await api.get('/delivery/rapidapi/config');
    return response.data;
  },

  // Test de RapidAPI completo
  testRapidAPI: async (data: any): Promise<any> => {
    const response = await api.post('/delivery/rapidapi/test', data);
    return response.data;
  },
};

// ==================== WEBHOOKS ====================

export const webhooksAPI = {
  // Los webhooks normalmente son llamados por servicios externos (MercadoPago)
  // No suelen ser llamados desde el frontend
};

// Exportar instancia de axios por si se necesita usar directamente
export default api;
