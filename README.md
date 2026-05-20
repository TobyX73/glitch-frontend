# Glitch - Frontend

> E-commerce de indumentaria con autenticación JWT, panel de administración y carrito de compras. Desarrollado en React + TypeScript, desplegado en Vercel.

🌐 **Demo en vivo:** [glitch-frontend-mauve.vercel.app](https://glitch-frontend-mauve.vercel.app)
🔗 **Backend:** [glitch-backend](https://github.com/TobyX73/glitch-backend)

---

## ¿Qué es Glitch?

Glitch es una plataforma de e-commerce de ropa construida de forma full-stack. El desafío principal fue diseñar una experiencia de compra completa, desde el catálogo de productos hasta la gestión de órdenes (incluyendo un panel de administración protegido por roles).

---

## Stack tecnológico

| Área | Tecnología |
|------|-----------|
| Framework | React 18 + TypeScript |
| Estilos | Tailwind CSS |
| Animaciones | Framer Motion |
| HTTP Client | Axios (con interceptores JWT) |
| Estado global | React Context API |
| Router | React Router v6 |
| Deploy | Vercel |
 
---

## Funcionalidades principales

### Para usuarios
- Registro e inicio de sesión con JWT
- Catálogo de productos con filtros por categoría
- Carrito de compras persistente
- Historial de órdenes propias
- Checkout con selección de talla y dirección de envío

### Para administradores
- Panel de administración protegido por rol (`/admin`)
- CRUD completo de productos (con carga de imágenes múltiples)
- Gestión de usuarios registrados
- Gestión y cambio de estado de órdenes (pendiente → confirmada / cancelada)
- Búsqueda y paginación en todas las vistas

---

## Arquitectura de autenticación

El sistema de auth utiliza JWT almacenado en `localStorage` con las siguientes características:

- **AuthContext** global que persiste la sesión al refrescar
- **Interceptor de Axios** que inyecta el token automáticamente en cada request
- **ProtectedRoute** que valida autenticación y rol antes de renderizar
- **Auto-logout** en respuestas 401 (token expirado)
- Rutas de admin requieren `role: "admin"` — los usuarios normales son redirigidos a `/`

---

## Estructura del proyecto

```
src/
├── context/
│   ├── AuthContext.tsx       # Estado global de autenticación
│   └── CartContext.tsx       # Estado global del carrito
├── services/
│   └── api.ts               # Todos los endpoints del backend
├── types/
│   ├── auth.types.ts
│   └── product.types.ts
├── components/
│   ├── ProtectedRoute.tsx   # Guards de ruta por rol
│   └── navbar.tsx
└── containers/
    ├── VistaLogin/
    ├── VistaRegister/
    ├── VistaProductos/
    └── admin/
        ├── VistaProductosAdmin/
        ├── VistaUsuariosAdmin/
        └── VistaOrdenesAdmin/
```

---

## Rutas disponibles

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Home |
| `/productos` | Catálogo |
| `/producto/:id` | Detalle de producto |
| `/login` | Iniciar sesión |
| `/register` | Registrarse |
| `/checkout` | Checkout |

### Protegidas (requieren `role: admin`)
| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard |
| `/admin/productos` | Listado de productos |
| `/admin/productos/nuevo` | Crear producto |
| `/admin/productos/editar/:id` | Editar producto |
| `/admin/usuarios` | Listado de usuarios |
| `/admin/ordenes` | Gestión de órdenes |

---

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/TobyX73/glitch-frontend.git
cd glitch-frontend/client/glitch

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear un archivo .env con:
VITE_API_URL=https://glitch-backend-uu8n.onrender.com/api

# Iniciar en desarrollo
npm run dev
```

> ⚠️ El backend está en el plan gratuito de Render, por lo que puede tardar ~30 segundos en responder si estuvo inactivo.


## Decisiones técnicas destacadas

**¿Por qué Context API y no Redux?**
El estado de la app es relativamente simple (auth + carrito), por lo que Context API evita overhead innecesario sin sacrificar legibilidad.

**¿Por qué interceptores en Axios?**
Centralizar la lógica de autenticación en un interceptor evita repetir el header `Authorization` en cada llamada y permite manejar el logout automático ante un 401 en un solo lugar.

**¿Por qué FormData para productos?**
El backend espera imágenes como archivos reales (multipart/form-data) para procesarlas con Multer y subirlas a Cloudinary. Enviarlas como JSON codificado en base64 hubiera aumentado el tamaño del payload innecesariamente.

---

## Estado actual del proyecto

- ✅ Autenticación completa (login, register, logout, persistencia)
- ✅ CRUD de productos con upload de imágenes
- ✅ Gestión de usuarios (listado, búsqueda, paginación)
- ✅ Gestión de órdenes con cambio de estado
- 🔄 Edición de producto (parcialmente implementada)
- 🔄 Vista de detalle individual de usuario/orden
- 📋 Dashboard con estadísticas (pendiente)

