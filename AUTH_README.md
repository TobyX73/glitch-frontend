# 🔐 Sistema de Autenticación - Glitch Frontend

## ✅ Implementación Completa

Se ha integrado completamente el sistema de autenticación con el backend en producción.

### 📦 Componentes Implementados

1. **AuthContext** (`src/context/AuthContext.tsx`)
   - Manejo de estado global de autenticación
   - Funciones: `login`, `register`, `logout`, `updateUser`
   - Persistencia en localStorage
   - Verificación automática de token al cargar la app
   - Interceptores de axios para tokens JWT

2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
   - Protección de rutas por autenticación
   - Protección de rutas por rol (admin/user)
   - Redirección automática a login si no está autenticado
   - Loader mientras verifica autenticación

3. **Login** (`src/containers/VistaLogin/VistaIndexLogin.tsx`)
   - Conectado al endpoint `/api/users/login`
   - Validación de formulario
   - Manejo de errores del servidor
   - Redirección automática después de login exitoso

4. **Register** (`src/containers/VistaRegister/VistaIndexRegister.tsx`)
   - Conectado al endpoint `/api/users/register`
   - Validación de campos (nombre, apellido, email, password)
   - Registro automático + login
   - Manejo de errores del servidor

5. **Navbar** (`src/components/navbar.tsx`)
   - Muestra usuario autenticado
   - Menú desplegable con opciones de usuario
   - Badge de "Admin" para administradores
   - Botón de cerrar sesión
   - Oculta "Panel de Admin" para usuarios normales

### 🔒 Rutas Protegidas

#### Rutas de Admin (requiere rol "admin"):
- `/admin` - Dashboard de administrador
- `/admin/productos` - Gestión de productos
- `/admin/productos/nuevo` - Crear producto
- `/admin/productos/:id` - Ver producto
- `/admin/productos/editar/:id` - Editar producto
- `/admin/usuarios` - Gestión de usuarios
- `/admin/usuarios/:id` - Ver usuario
- `/admin/ordenes` - Gestión de órdenes
- `/admin/ordenes/:id` - Ver orden

#### Rutas Públicas:
- `/` - Home
- `/productos` - Lista de productos
- `/producto/:id` - Detalle de producto
- `/contacto` - Contacto
- `/nosotros` - Acerca de
- `/login` - Iniciar sesión
- `/register` - Registrarse
- `/checkout` - Checkout (puede requerir auth según implementación)

### 🧪 Credenciales de Prueba

Según mencionaste que tienes 2 usuarios en el backend:

**Usuario Administrador:**
```
Email: [tu-admin-email]
Password: [tu-admin-password]
```

**Usuario Normal:**
```
Email: [tu-user-email]
Password: [tu-user-password]
```

### 🚀 Cómo Usar

1. **Iniciar la aplicación:**
   ```bash
   npm run dev
   ```

2. **Probar Login:**
   - Ir a `/login`
   - Ingresar credenciales
   - Si es admin, verás "Panel de Admin" en el navbar
   - Click en tu nombre para ver el menú de usuario

3. **Probar Register:**
   - Ir a `/register`
   - Completar el formulario
   - Se creará cuenta y se iniciará sesión automáticamente

4. **Probar Protección de Rutas:**
   - Sin login: Intentar acceder a `/admin` → redirige a `/login`
   - Con usuario normal: Intentar acceder a `/admin` → redirige a `/`
   - Con admin: Acceso completo a `/admin`

### 📡 Endpoints Conectados

**Base URL:** `https://glitch-backend-uu8n.onrender.com/api`

- `POST /users/register` - Registro de usuario
- `POST /users/login` - Inicio de sesión
- `GET /users/profile` - Obtener perfil (con token)

### 🔧 Próximos Pasos Sugeridos

1. **Conectar CRUD de Productos:**
   - Usar `productsAPI` del archivo `api.ts`
   - Ya está todo configurado para usar

2. **Agregar rutas protegidas para usuarios:**
   ```tsx
   <Route path="/mis-ordenes" element={
     <ProtectedRoute>
       <MisOrdenes />
     </ProtectedRoute>
   } />
   ```

3. **Perfil de usuario:**
   - Crear página de perfil
   - Usar `authAPI.getProfile()` y `authAPI.updateProfile()`

### 🛠️ Estructura de Archivos

```
src/
├── context/
│   ├── AuthContext.tsx      ✅ Context de autenticación
│   └── CartContext.tsx
├── services/
│   └── api.ts              ✅ Todos los endpoints del backend
├── types/
│   └── auth.types.ts       ✅ Tipos de TypeScript
├── components/
│   ├── App.tsx             ✅ Rutas protegidas
│   ├── navbar.tsx          ✅ Navbar con auth
│   └── ProtectedRoute.tsx  ✅ Componente de protección
└── containers/
    ├── VistaLogin/         ✅ Login conectado
    └── VistaRegister/      ✅ Register conectado
```

### 💡 Características Adicionales

- ✅ Persistencia de sesión (localStorage)
- ✅ Auto-logout en token expirado (401)
- ✅ Loader mientras verifica autenticación
- ✅ Manejo de errores del servidor
- ✅ Menú de usuario responsive
- ✅ Click fuera para cerrar menú
- ✅ Badge visual para administradores
- ✅ TypeScript con tipado completo

### 📝 Notas

- El backend puede tardar ~30 segundos en despertar si está en modo hibernación (plan gratuito de Render)
- Los tokens JWT se guardan en localStorage
- La sesión persiste al refrescar la página
- El interceptor de axios agrega automáticamente el token a todas las peticiones
