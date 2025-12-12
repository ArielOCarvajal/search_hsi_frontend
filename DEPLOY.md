# Deploy en Railway - Frontend

Este documento describe cómo desplegar el frontend en Railway.

## Requisitos previos

1. Cuenta en [Railway](https://railway.app)
2. Backend ya desplegado en Railway (necesitarás su URL)
3. Railway CLI instalado (opcional): `npm i -g @railway/cli`

## Paso 1: Crear servicio en Railway

1. Inicia sesión en [Railway](https://railway.app)
2. Abre tu proyecto existente (o crea uno nuevo)
3. Haz clic en "+ New"
4. Selecciona "GitHub Repo"
5. Selecciona el repositorio del frontend

## Paso 2: Configurar variables de entorno

En la sección "Variables" de tu servicio frontend en Railway, agrega:

```
VITE_API_URL=https://your-backend.up.railway.app/api/v1
```

**Importante:**
- Reemplaza `your-backend.up.railway.app` con la URL real de tu backend desplegado
- No incluyas barra final en la URL
- El prefijo `VITE_` es necesario para que Vite exponga la variable al cliente

## Paso 3: Configurar el deploy

Railway detectará automáticamente:
- El `Dockerfile` para construir la aplicación
- El `railway.json` para configuración adicional

El proceso de build:
1. Instalará las dependencias con `npm ci`
2. Construirá la aplicación con `npm run build`
3. Usará Nginx para servir los archivos estáticos

## Paso 4: Deploy

1. Railway automáticamente iniciará el deploy
2. Puedes ver el progreso en la pestaña "Deployments"
3. El build puede tomar 2-5 minutos

## Paso 5: Configurar dominio público

1. Ve a la pestaña "Settings" de tu servicio
2. En "Networking", haz clic en "Generate Domain"
3. Railway generará un dominio público: `your-frontend.up.railway.app`

## Paso 6: Actualizar CORS en el backend

Una vez que tengas la URL del frontend, vuelve al backend y actualiza la variable `CORS_ORIGINS`:

```
CORS_ORIGINS=["https://your-frontend.up.railway.app","http://localhost:5173"]
```

## Paso 7: Verificar el deploy

1. Abre la URL generada: `https://your-frontend.up.railway.app`
2. Verifica que la aplicación carga correctamente
3. Prueba la funcionalidad de búsqueda de usuarios
4. Verifica que la comunicación con el backend funcione

## Configuración de Nginx

El archivo `nginx.conf` incluye:
- Compresión Gzip para mejorar performance
- Headers de seguridad
- Soporte para React Router (SPA routing)
- Caché de assets estáticos

## Comandos útiles (Railway CLI)

```bash
# Ver logs en tiempo real
railway logs

# Ver variables de entorno
railway variables

# Forzar un nuevo deploy
railway up
```

## Troubleshooting

### La aplicación muestra página en blanco
- Verifica que `VITE_API_URL` esté configurada correctamente
- Revisa los logs del navegador (F12 > Console) para errores
- Asegúrate de que el build se completó exitosamente

### Errores de CORS
- Verifica que la URL del frontend esté en la variable `CORS_ORIGINS` del backend
- Asegúrate de usar HTTPS en producción
- Verifica que no haya barras finales en las URLs

### Cambios no se reflejan
- Railway cachea builds. Haz clic en "Redeploy" para forzar un nuevo build
- Limpia el caché del navegador (Ctrl + Shift + R)

### Error 404 en rutas
- El archivo `nginx.conf` debe estar correctamente configurado
- Verifica que el archivo existe y está copiado en el Dockerfile
- El `try_files` debe incluir `$uri $uri/ /index.html`

### Error de conexión con el backend
- Verifica que `VITE_API_URL` apunte a la URL correcta del backend
- Asegúrate de que el backend esté corriendo
- Verifica los CORS en el backend

## Actualización de la aplicación

Para actualizar la aplicación:

1. Haz commit de tus cambios en GitHub
2. Push al branch principal
3. Railway automáticamente detectará los cambios y redesplegará

## Variables de entorno en desarrollo vs producción

**Desarrollo (.env):**
```
VITE_API_URL=http://localhost:8000/api/v1
```

**Producción (Railway):**
```
VITE_API_URL=https://your-backend.up.railway.app/api/v1
```
