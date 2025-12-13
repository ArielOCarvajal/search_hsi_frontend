# Solución: Variables de Entorno de Vite en Railway con Docker

## El Problema

Cuando despliegas una aplicación Vite (React, Vue, etc.) en Railway usando Docker, las variables de entorno con prefijo `VITE_` no se están aplicando correctamente. El navegador muestra errores como:

```
POST http://localhost:8000/api/v1/auth/login net::ERR_CONNECTION_REFUSED
```

A pesar de haber configurado `VITE_API_URL=https://mi-backend.railway.app/api/v1` en las variables de entorno de Railway.

## Causa Raíz

**Este NO es un problema de cache de Railway.** Es un problema de **arquitectura de build**.

### Diferencia Clave: Build-Time vs Runtime

| Aspecto | Build-Time | Runtime |
|---------|------------|---------|
| **Cuándo ocurre** | Durante `npm run build` | Cuando el contenedor se ejecuta |
| **Variables de Vite** | ✅ Se leen aquí | ❌ NO se leen aquí |
| **Variables de Railway** | ❌ Por defecto NO están disponibles | ✅ Están disponibles |

**El problema:**
1. Vite **embebe** las variables de entorno en el JavaScript durante `npm run build` (build-time)
2. Railway **inyecta** las variables de entorno cuando el contenedor se ejecuta (runtime)
3. Para cuando Railway inyecta las variables, Vite ya generó el bundle con valores incorrectos

### Flujo del Problema

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Railway inicia build                                         │
│    └─> Ejecuta: docker build                                    │
├─────────────────────────────────────────────────────────────────┤
│ 2. Dockerfile ejecuta: npm run build                            │
│    └─> Vite busca: import.meta.env.VITE_API_URL                 │
│    └─> NO encuentra la variable (Railway aún no la inyectó)     │
│    └─> Usa fallback: 'http://localhost:8000/api/v1'             │
├─────────────────────────────────────────────────────────────────┤
│ 3. Vite genera dist/index-XXXXX.js                              │
│    └─> Con localhost:8000 HARDCODEADO en el código              │
├─────────────────────────────────────────────────────────────────┤
│ 4. Railway inyecta VITE_API_URL en runtime                      │
│    └─> ⚠️  Ya es tarde, el JS ya fue generado                   │
├─────────────────────────────────────────────────────────────────┤
│ 5. Navegador ejecuta el JavaScript                              │
│    └─> Intenta conectar a localhost:8000                        │
│    └─> ❌ ERR_CONNECTION_REFUSED                                │
└─────────────────────────────────────────────────────────────────┘
```

## La Solución: Build Arguments en Docker

### 1. Modificar el Dockerfile

Necesitas pasar las variables de entorno de Vite como **build arguments** para que estén disponibles durante `npm run build`.

**Antes (❌ No funciona):**
```dockerfile
# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build  # ❌ VITE_API_URL no está disponible aquí

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
```

**Después (✅ Funciona):**
```dockerfile
# Build stage
FROM node:20-alpine as build

WORKDIR /app

# ✅ Aceptar VITE_API_URL como build argument
ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build  # ✅ Ahora VITE_API_URL está disponible

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
```

### Explicación del Código

```dockerfile
ARG VITE_API_URL=http://localhost:8000/api/v1
```
- Define un **build argument** que puede ser pasado desde Railway
- El valor por defecto `http://localhost:8000/api/v1` permite builds locales sin configuración adicional

```dockerfile
ENV VITE_API_URL=$VITE_API_URL
```
- Convierte el build argument en una **variable de entorno**
- Esto hace que esté disponible durante `npm run build`
- Vite puede accederla mediante `import.meta.env.VITE_API_URL`

### 2. Configurar Variables en Railway

**En el Dashboard de Railway:**

1. Abre tu proyecto
2. Selecciona el servicio del **frontend**
3. Ve a la pestaña **"Variables"**
4. Agrega o verifica:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api/v1
   ```
5. Guarda los cambios

**Nota Importante:** Railway automáticamente pasa las variables de entorno como build arguments a Docker. No necesitas configuración adicional en `railway.json`.

### 3. Código del Frontend

En tu servicio de API (`src/services/api.js` o similar):

```javascript
// ✅ Esto funciona correctamente con la solución
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function login(usuario, contrasena) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usuario, contrasena })
  });
  return handleResponse(response);
}
```

Durante el build:
- En **desarrollo local**: usa el fallback `http://localhost:8000/api/v1`
- En **Railway**: usa `https://tu-backend.railway.app/api/v1` (pasado como build arg)

## Deployment

### Primer Deploy con la Solución

1. **Modifica el Dockerfile** como se muestra arriba
2. **Configura las variables** en Railway
3. **Haz commit y push:**
   ```bash
   git add Dockerfile
   git commit -m "Fix: Pasar VITE_API_URL como build argument para Railway"
   git push origin main
   ```
4. **Railway detectará** el push y iniciará un nuevo build automáticamente

### (Opcional) Limpiar Cache de Railway

Si Railway está usando cache de builds anteriores y quieres forzar un rebuild completo:

**Opción A: Variable Temporal**
```
NO_CACHE=1
```
o
```
RAILPACK_DISABLE_CACHE=*
```
- Agrega esta variable en Railway
- Espera a que termine el deploy
- **Elimina la variable** después del primer build exitoso

**Opción B: Archivo de Clear Cache**
```bash
# En la raíz del proyecto frontend
touch .railway-clear-cache
git add .railway-clear-cache
git commit -m "Force Railway cache clear"
git push

# Después del deploy exitoso, eliminar el archivo
git rm .railway-clear-cache
git commit -m "Remove cache clear file"
git push
```

## Verificación

### En los Logs de Railway

Durante el build, busca líneas como:
```
#7 [build 2/7] ARG VITE_API_URL=http://localhost:8000/api/v1
#8 [build 3/7] ENV VITE_API_URL=https://tu-backend.railway.app/api/v1
```

Esto confirma que la variable se pasó correctamente.

### En el Navegador

1. Abre la aplicación deployada
2. Abre **DevTools** (F12)
3. Ve a la pestaña **"Network"**
4. Intenta hacer login o cualquier llamada API
5. Verifica que la petición vaya a:
   ```
   ✅ https://tu-backend.railway.app/api/v1/auth/login
   ❌ NO http://localhost:8000/api/v1/auth/login
   ```

### Si Aún Aparece localhost

**Limpia la cache del navegador:**
- **Windows/Linux:** Ctrl + Shift + Delete
- **Mac:** Cmd + Shift + Delete

**Haz un hard refresh:**
- **Windows/Linux:** Ctrl + Shift + R
- **Mac:** Cmd + Shift + R

**Revisa los logs de build:**
- Asegúrate que `VITE_API_URL` se pasó correctamente durante el build

## Solución para Múltiples Variables

Si tienes **múltiples variables de entorno** de Vite (ej: `VITE_API_URL`, `VITE_AUTH_DOMAIN`, etc.):

```dockerfile
# Build stage
FROM node:20-alpine as build

WORKDIR /app

# ✅ Declara TODAS las variables de Vite que necesites
ARG VITE_API_URL=http://localhost:8000/api/v1
ARG VITE_AUTH_DOMAIN=http://localhost:8000
ARG VITE_APP_ENV=development

# ✅ Conviértelas a variables de entorno
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_DOMAIN=$VITE_AUTH_DOMAIN
ENV VITE_APP_ENV=$VITE_APP_ENV

# ... resto del Dockerfile
```

Y en Railway, configura todas:
```
VITE_API_URL=https://tu-backend.railway.app/api/v1
VITE_AUTH_DOMAIN=https://tu-backend.railway.app
VITE_APP_ENV=production
```

## Otras Plataformas (Render, Vercel, etc.)

Esta solución funciona en **cualquier plataforma** que use Docker:

- **Render:** Configura las variables en "Environment"
- **Google Cloud Run:** Usa `--build-env-vars-file` o `--set-build-env-vars`
- **AWS ECS/Fargate:** Pasa build args en el template de CloudFormation
- **DigitalOcean App Platform:** Configura en "Environment Variables" con scope "Build Time"

### Nota sobre Vercel

Vercel **NO necesita** esta solución porque:
1. No usa Docker
2. Ejecuta `npm run build` directamente
3. Las variables de entorno están disponibles automáticamente durante el build

## Resumen

| Problema | Solución |
|----------|----------|
| Variables de Vite no se aplican en Railway | Usar `ARG` y `ENV` en Dockerfile |
| Build usa localhost en lugar de URL de producción | Pasar variables como build arguments |
| Cache de Railway impide ver cambios | Agregar `NO_CACHE=1` o `.railway-clear-cache` |
| Navegador sigue mostrando localhost | Limpiar cache del navegador + hard refresh |

## Referencias

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Docker ARG vs ENV](https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact)
- [Railway Build Configuration](https://docs.railway.com/guides/build-configuration)
- [Railway Clear Cache Methods](https://station.railway.com/questions/clear-cache-af486256)

---

**Documento creado:** 2025-12-13
**Última actualización:** 2025-12-13
**Probado en:** Railway (Diciembre 2025)
