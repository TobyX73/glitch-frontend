# 🐛 Debug de Autenticación Admin

## Problema
No puedes acceder a la cuenta de admin.

## ✅ Verificaciones realizadas

### 1. **Código sin errores de compilación**
- ✅ Todos los tipos TypeScript correctos
- ✅ AuthContext implementado correctamente
- ✅ ProtectedRoute funciona bien
- ✅ isAdmin se calcula como: `user.role === 'admin'`

### 2. **Flujo de autenticación**
```typescript
// En AuthContext.tsx línea 54
isAdmin: action.payload.user.role === 'admin'

// En ProtectedRoute.tsx línea 30
if (requireAdmin && !state.isAdmin) {
  return <Navigate to="/" replace />;
}
```

## 🔍 Pasos para diagnosticar

### Opción 1: Verificar en el navegador

1. **Abre las DevTools** (F12)
2. **Ve a Console** y ejecuta:
```javascript
// Ver el token guardado
console.log('Token:', localStorage.getItem('token'));

// Ver el usuario guardado
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

3. **Verifica el rol del usuario**:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('Role:', user?.role);
console.log('Is Admin:', user?.role === 'admin');
```

### Opción 2: Agregar logs en el login

Agrega esto temporalmente en `VistaIndexLogin.tsx` después de llamar a `login()`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // ... código existente ...
  
  try {
    await login(formData);
    
    // 🐛 DEBUG: Ver qué se guardó
    const savedUser = localStorage.getItem('user');
    const parsedUser = JSON.parse(savedUser);
    console.log('🔍 Usuario guardado:', parsedUser);
    console.log('🔍 Rol del usuario:', parsedUser.role);
    console.log('🔍 Es admin?:', parsedUser.role === 'admin');
    
    navigate('/');
  } catch (err: any) {
    // ...
  }
};
```

### Opción 3: Verificar respuesta del backend

**En Postman o Thunder Client:**

```bash
POST https://glitch-backend-uu8n.onrender.com/api/users/login
Content-Type: application/json

{
  "email": "tu-email-admin@ejemplo.com",
  "password": "tu-contraseña"
}
```

**Debe devolver algo como:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "email": "admin@ejemplo.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"  // ← IMPORTANTE: Debe decir "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login exitoso"
}
```

## 🔧 Posibles Soluciones

### Solución 1: Limpiar localStorage y volver a hacer login

En la consola del navegador:
```javascript
localStorage.clear();
location.reload();
```

Luego vuelve a hacer login con la cuenta admin.

### Solución 2: Verificar que el usuario en la BD tenga role: 'admin'

En MongoDB o en tu backend, verifica:
```javascript
// El usuario debe tener:
{
  email: "admin@ejemplo.com",
  role: "admin"  // ← Exactamente así, en minúsculas
}
```

### Solución 3: Si el backend devuelve `isAdmin` en lugar de `role`

Si tu backend devuelve:
```json
{
  "user": {
    "isAdmin": true  // En lugar de "role": "admin"
  }
}
```

Debes cambiar en `AuthContext.tsx` línea 54:
```typescript
// De:
isAdmin: action.payload.user.role === 'admin',

// A:
isAdmin: action.payload.user.role === 'admin' || action.payload.user.isAdmin === true,
```

## 🎯 Test Rápido

**Desde la consola del navegador (estando logueado):**

```javascript
// Ver el estado de auth
const authState = JSON.parse(localStorage.getItem('user'));
console.table({
  'Email': authState?.email,
  'Nombre': authState?.firstName + ' ' + authState?.lastName,
  'Rol': authState?.role,
  'Es Admin?': authState?.role === 'admin'
});
```

## 📝 Checklist

- [ ] Limpiaste localStorage
- [ ] Verificaste que el usuario tiene `role: "admin"` en la base de datos
- [ ] Confirmaste que el login devuelve `role: "admin"` en la respuesta
- [ ] El token se guarda correctamente en localStorage
- [ ] No hay errores en la consola del navegador
- [ ] ProtectedRoute muestra el loader y luego redirige

## 🆘 Si nada funciona

**Agrega este código temporal en `ProtectedRoute.tsx` para forzar acceso:**

```typescript
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { state } = useAuth();

  // 🐛 DEBUG TEMPORAL
  console.log('🔍 ProtectedRoute State:', {
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.isAdmin,
    requireAdmin,
    user: state.user
  });

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (!state.isAuthenticated) {
    console.warn('❌ No autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !state.isAdmin) {
    console.warn('❌ No es admin, redirigiendo a /');
    console.log('Usuario actual:', state.user);
    return <Navigate to="/" replace />;
  }

  console.log('✅ Acceso permitido');
  return <>{children}</>;
};
```

---

**Por favor, ejecuta los pasos de diagnóstico y dime qué ves en la consola.**
