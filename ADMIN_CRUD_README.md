# CRUD Admin - Documentaci\u00f3n

## \ud83d\udcda Overview

Este documento describe la implementaci\u00f3n completa del sistema CRUD de administraci\u00f3n conectado al backend de Glitch.

## \ud83d\udd17 Endpoints Conectados

### **Productos**
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Ver producto espec\u00edfico
- `POST /api/products` - Crear nuevo producto (requiere admin)
- `PUT /api/products/:id` - Actualizar producto (requiere admin)
- `DELETE /api/products/:id` - Eliminar producto (requiere admin)

### **Usuarios**
- `GET /api/users` - Listar todos los usuarios (requiere admin)
- `GET /api/users/:id` - Ver usuario espec\u00edfico (requiere admin)

### **\u00d3rdenes**
- `GET /api/orders` - Listar todas las \u00f3rdenes (admin ve todas)
- `GET /api/orders/:id` - Ver orden espec\u00edfica
- `PATCH /api/orders/:id/status` - Actualizar estado de orden

### **Categor\u00edas**
- `GET /api/categories` - Listar todas las categor\u00edas
- `GET /api/categories/:id` - Ver categor\u00eda espec\u00edfica

## \ud83d\udccb Vistas Implementadas

### 1. **VistaProductosAdmin** (`/admin/productos`)
**Funcionalidades:**
- \u2705 Listar productos con paginaci\u00f3n (10 por p\u00e1gina)
- \u2705 B\u00fasqueda por nombre
- \u2705 Ver detalles de producto
- \u2705 Editar producto
- \u2705 Eliminar producto con confirmaci\u00f3n
- \u2705 Loading state mientras carga datos
- \u2705 Manejo de errores

**Estados:**
```typescript
- products: Product[] - Lista de productos
- isLoading: boolean - Estado de carga
- error: string | null - Mensajes de error
- searchTerm: string - T\u00e9rmino de b\u00fasqueda
- currentPage: number - P\u00e1gina actual
```

**Datos mostrados:**
- Imagen principal
- Nombre y categor\u00eda
- Precio
- Stock (con indicador verde/rojo)
- Tallas disponibles

---

### 2. **CrearProducto** (`/admin/productos/nuevo`)
**Funcionalidades:**
- \u2705 Formulario completo de creaci\u00f3n
- \u2705 Carga de m\u00faltiples im\u00e1genes (drag & drop)
- \u2705 Selecci\u00f3n de tallas (S, M, L, XL, XXL)
- \u2705 Selecci\u00f3n de categor\u00eda (cargada desde backend)
- \u2705 Validaci\u00f3n de campos
- \u2705 Preview de im\u00e1genes
- \u2705 Env\u00edo con FormData al backend
- \u2705 Redirecci\u00f3n a listado despu\u00e9s de crear

**Campos del formulario:**
```typescript
{
  name: string;          // Nombre del producto *
  description: string;   // Descripci\u00f3n *
  price: string;         // Precio *
  stock: string;         // Stock *
  category: string;      // ID de categor\u00eda *
  sizes: string[];       // Tallas seleccionadas *
  images: File[];        // Im\u00e1genes a subir *
}
```

**Validaciones:**
- Nombre requerido
- Descripci\u00f3n requerida
- Precio > 0
- Stock >= 0
- Categor\u00eda seleccionada
- Al menos una talla
- Al menos una imagen

---

### 3. **EditarProducto** (`/admin/productos/editar/:id`)
**Funcionalidades:**
- \u26a0\ufe0f **Parcialmente implementado** - Necesita finalizaci\u00f3n
- \ud83d\udd04 Cargar datos del producto existente
- \ud83d\udd04 Mantener im\u00e1genes existentes
- \ud83d\udd04 Agregar nuevas im\u00e1genes
- \ud83d\udd04 Eliminar im\u00e1genes existentes
- \ud83d\udd04 Actualizar todos los campos

**TODO:** 
- Completar integraci\u00f3n con `productsAPI.update()`
- Cargar categor\u00edas desde backend
- Manejar im\u00e1genes existentes vs nuevas

---

### 4. **VistaUsuariosAdmin** (`/admin/usuarios`)
**Funcionalidades:**
- \u2705 Listar usuarios registrados
- \u2705 B\u00fasqueda por nombre o email
- \u2705 Paginaci\u00f3n (10 por p\u00e1gina)
- \u2705 Ver detalles de usuario
- \u2705 Mostrar rol (Admin/Usuario)
- \u2705 Fecha de registro

**Datos mostrados:**
```typescript
{
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}
```

**Estad\u00edsticas:**
- Total de usuarios registrados

---

### 5. **VistaOrdenesAdmin** (`/admin/ordenes`)
**Funcionalidades:**
- \u2705 Listar todas las \u00f3rdenes
- \u2705 B\u00fasqueda por ID o cliente
- \u2705 Filtrar por estado (Todas/Pendientes/Confirmadas/Canceladas)
- \u2705 Ordenar por prioridad (pendientes primero)
- \u2705 Cambiar estado a "Confirmada"
- \u2705 Cambiar estado a "Cancelada"
- \u2705 Paginaci\u00f3n (10 por p\u00e1gina)
- \u2705 Ver detalles de orden

**Estados de orden:**
- `pending` - En Confirmaci\u00f3n (\ud83d\udfe1 Amarillo)
- `confirmed` - Confirmada (\ud83d\udfe2 Verde)
- `cancelled` - Cancelada (\ud83d\udd34 Rojo)

**Datos mostrados:**
```typescript
{
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
```

**Estad\u00edsticas:**
- Total de \u00f3rdenes
- En confirmaci\u00f3n
- Confirmadas
- Canceladas

**Acciones disponibles:**
- Ver detalles
- Confirmar (\u2705 solo si est\u00e1 pendiente)
- Cancelar (\u274c solo si est\u00e1 pendiente o confirmada)

---

## \ud83d\udce6 Tipos TypeScript

### Archivo: `src/types/product.types.ts`

```typescript
// Producto
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

// Categor\u00eda
export interface Category {
  _id: string;
  name: string;
  description?: string;
}

// Usuario
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Orden
export interface Order {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  size: string;
  price: number;
}
```

---

## \ud83d\udd10 Protecci\u00f3n de Rutas

Todas las rutas de admin est\u00e1n protegidas con `ProtectedRoute`:

```tsx
<Route path="/admin/*" element={
  <ProtectedRoute requireAdmin>
    <VistaIndexAdmin />
  </ProtectedRoute>
}>
```

**Validaciones:**
1. Usuario debe estar autenticado (`isAuthenticated`)
2. Usuario debe tener rol `admin` (`isAdmin`)
3. Si no cumple, redirige a `/login` o `/`

---

## \ud83d\udee0\ufe0f API Client

### Archivo: `src/services/api.ts`

**Productos:**
```typescript
productsAPI.getAll()                    // GET /api/products
productsAPI.getById(id)                 // GET /api/products/:id
productsAPI.create(formData)            // POST /api/products
productsAPI.update(id, formData)        // PUT /api/products/:id
productsAPI.updateStock(id, stock)      // PATCH /api/products/:id/stock
productsAPI.delete(id)                  // DELETE /api/products/:id
```

**Usuarios:**
```typescript
usersAPI.getAll()                       // GET /api/users
usersAPI.getById(id)                    // GET /api/users/:id
usersAPI.updateRole(id, role)           // PUT /api/users/:id/role
```

**\u00d3rdenes:**
```typescript
ordersAPI.getAll()                      // GET /api/orders
ordersAPI.getById(id)                   // GET /api/orders/:id
ordersAPI.updateStatus(id, status)      // PATCH /api/orders/:id/status
```

**Categor\u00edas:**
```typescript
categoriesAPI.getAll()                  // GET /api/categories
categoriesAPI.getById(id)               // GET /api/categories/:id
```

---

## \u2705 Checklist de Implementaci\u00f3n

### Productos
- [x] Listar productos
- [x] Ver producto
- [x] Crear producto
- [ ] Editar producto (parcial)
- [x] Eliminar producto
- [x] Cargar categor\u00edas din\u00e1micamente
- [x] Upload de im\u00e1genes

### Usuarios
- [x] Listar usuarios
- [ ] Ver detalles de usuario (vista individual)
- [ ] Cambiar rol de usuario
- [x] B\u00fasqueda y paginaci\u00f3n

### \u00d3rdenes
- [x] Listar \u00f3rdenes
- [x] Filtrar por estado
- [x] Confirmar orden
- [x] Cancelar orden
- [ ] Ver detalles de orden (vista individual)
- [x] B\u00fasqueda y paginaci\u00f3n

---

## \ud83d\udca1 Pr\u00f3ximos Pasos

1. **Completar EditarProducto**
   - Finalizar integraci\u00f3n con backend
   - Manejar correctamente im\u00e1genes existentes

2. **Crear VerProducto**
   - Vista de detalles de producto individual
   - Mostrar historial de cambios

3. **Crear VerUsuario**
   - Vista de detalles de usuario
   - Listar \u00f3rdenes del usuario
   - Opci\u00f3n para cambiar rol

4. **Crear VerOrden**
   - Vista de detalles completos de orden
   - Productos incluidos
   - Direcci\u00f3n de env\u00edo
   - M\u00e9todo de pago
   - Timeline de estados

5. **Mejoras adicionales**
   - Dashboard con estad\u00edsticas
   - Gr\u00e1ficos de ventas
   - Exportar datos a CSV/Excel
   - Notificaciones en tiempo real

---

## \ud83d\udc1b Manejo de Errores

Todas las vistas implementan:
- **Loading state**: Spinner mientras carga datos
- **Error state**: Mensaje de error si falla la petici\u00f3n
- **Empty state**: Mensaje cuando no hay datos
- **Try-catch**: En todas las llamadas al backend
- **Feedback visual**: Confirmaciones y alertas

---

## \ud83c\udfa8 Estilos

**Paleta de colores:**
- `bg-gris`: Fondo principal
- `bg-azul`: Fondo secundario
- `text-verde`: Color de acento
- `border-verde`: Bordes principales

**Componentes animados:**
- Framer Motion para animaciones
- Hover effects en botones
- Transiciones suaves

---

## \ud83d\udcdd Notas Importantes

1. **Autenticaci\u00f3n**: Todos los endpoints usan JWT token autom\u00e1ticamente via interceptor de Axios
2. **FormData**: Para productos con im\u00e1genes, se usa `FormData` en lugar de JSON
3. **IDs de MongoDB**: El backend usa `_id` (no `id`)
4. **Categor\u00edas**: Pueden ser populadas (objeto) o solo ID (string)
5. **CORS**: Ya configurado en el backend para `http://localhost:5173`

---

\ud83d\ude80 **El CRUD de Admin est\u00e1 listo para usar!**
