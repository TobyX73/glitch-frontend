# 🔧 Solución de Problemas - Network Error

## ❌ Problema: "Network Error" al intentar login

### Causas Comunes:

1. **Backend hibernado (Render plan gratuito)** ⏳
   - El servidor se duerme después de 15 minutos de inactividad
   - Tarda ~30 segundos en despertar
   - **Solución implementada:** Banner automático que detecta cuando el servidor está despertando

2. **Problema de CORS** 🚫
   - El backend no tiene configurado el frontend como origen permitido
   - **Solución:** Configurar CORS en el backend

3. **URL incorrecta** 🔗
   - La URL del backend puede haber cambiado
   - **Verificar:** `https://glitch-backend-uu8n.onrender.com/api`

---

## ✅ Soluciones Implementadas en el Frontend:

### 1. Timeout Extendido
```typescript
// api.ts
const api = axios.create({
  timeout: 60000, // 60 segundos
});
```

### 2. Detección del Estado del Servidor
- Banner automático que muestra cuando el servidor está despertando
- Reintenta cada 5 segundos hasta que el servidor responda
- Muestra "Servidor listo ✓" cuando está disponible

### 3. Mensajes de Error Mejorados
- Error de red: "El servidor está despertando... espera 30 segundos"
- Error 401/400: "Email o contraseña incorrectos"
- Otros errores: Mensaje específico del backend

---

## 🛠️ Configuración Necesaria en el Backend

### Verificar CORS en `server.ts` o `index.ts`:

```typescript
import cors from 'cors';

// Opción 1: Permitir todos los orígenes (solo para desarrollo)
app.use(cors());

// Opción 2: Permitir solo tu frontend (RECOMENDADO)
app.use(cors({
  origin: [
    'http://localhost:5173',           // Desarrollo local
    'https://tu-dominio.vercel.app',   // Producción
    'https://tu-dominio.netlify.app'   // Otro dominio
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Si no tienes `cors` instalado:

```bash
npm install cors
npm install --save-dev @types/cors
```

---

## 🧪 Cómo Probar:

### 1. Verificar que el backend esté funcionando:

Abre en el navegador:
```
https://glitch-backend-uu8n.onrender.com/
```

Deberías ver algo como:
```
Cannot GET /
```
O el mensaje que tengas configurado en la ruta raíz.

### 2. Probar el endpoint de usuarios:

```bash
# En Postman o Thunder Client
GET https://glitch-backend-uu8n.onrender.com/api/users
```

### 3. Probar login desde el frontend:

1. Abrir DevTools (F12)
2. Ir a pestaña "Network"
3. Intentar login
4. Ver qué error aparece:
   - **ERR_NETWORK**: Backend no responde o CORS
   - **401**: Credenciales incorrectas
   - **404**: Ruta incorrecta
   - **500**: Error del servidor

---

## 📋 Checklist de Verificación:

- [ ] Backend está corriendo en Render
- [ ] CORS está configurado en el backend
- [ ] La URL del backend es correcta
- [ ] El backend responde en `https://glitch-backend-uu8n.onrender.com/`
- [ ] Esperaste 30 segundos si el servidor estaba hibernado
- [ ] No hay errores en la consola del backend (ver logs en Render)

---

## 🔍 Verificar Logs del Backend en Render:

1. Ir a https://dashboard.render.com
2. Seleccionar tu servicio `glitch-backend`
3. Click en "Logs"
4. Buscar errores relacionados con CORS o rutas

---

## 💡 Tip: Mantener el Backend Activo

Para evitar que se hiberne (solo desarrollo):

### Opción 1: Ping automático cada 10 minutos
Usar un servicio como:
- https://uptimerobot.com
- https://cron-job.org

### Opción 2: Script local
Crear un archivo `keep-alive.js`:
```javascript
setInterval(() => {
  fetch('https://glitch-backend-uu8n.onrender.com/')
    .then(() => console.log('Ping enviado'))
    .catch(() => console.log('Error en ping'));
}, 10 * 60 * 1000); // Cada 10 minutos
```

---

## 📞 Si el Problema Persiste:

1. **Verificar en la consola del navegador:**
   ```
   F12 → Console → buscar errores
   ```

2. **Verificar headers de la petición:**
   ```
   F12 → Network → click en la petición fallida → Headers
   ```

3. **Probar con curl:**
   ```bash
   curl -X POST https://glitch-backend-uu8n.onrender.com/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"123456"}'
   ```

4. **Contactar soporte de Render** si el problema es del servidor

---

## ✅ Estado Actual del Frontend:

- ✅ Timeout de 60 segundos configurado
- ✅ Detección automática del estado del servidor
- ✅ Banner informativo en el login
- ✅ Manejo mejorado de errores
- ✅ Mensajes específicos para cada tipo de error
- ✅ Retry automático cada 5 segundos

---

## 🎯 Siguiente Paso:

**Si ves el banner "Servidor listo ✓"** pero aún falla el login:
→ El problema es CORS o credenciales incorrectas
→ Revisar la configuración de CORS en el backend
