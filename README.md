# Search HSI - Frontend

Frontend de la aplicación de búsqueda de usuarios del Hospital San Ignacio (HSI).

Desarrollado con React + Vite para una experiencia de usuario rápida y moderna.

## Características

- 🔍 Búsqueda avanzada de usuarios con múltiples filtros
- 🎨 Interfaz de usuario moderna y responsiva
- ⚡ Build optimizado con Vite
- 🔐 Sistema de autenticación
- 📊 Visualización de datos de usuarios

## Stack Tecnológico

- **Framework:** React 18
- **Build Tool:** Vite 6
- **Estilos:** CSS Modules
- **Calidad de Código:** ESLint
- **Servidor Web:** Nginx (producción)
- **Deployment:** Docker + Railway

## Desarrollo Local

### Requisitos

- Node.js 20+
- npm 9+

### Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones locales
# VITE_API_URL=http://localhost:8000/api/v1
```

### Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Linting
npm run lint
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

**Importante:** Las variables deben tener el prefijo `VITE_` para que Vite las exponga al cliente.

## Estructura del Proyecto

```
search_hsi_frontend/
├── src/
│   ├── components/       # Componentes React reutilizables
│   ├── pages/           # Páginas de la aplicación
│   ├── services/        # Servicios API y lógica de negocio
│   ├── styles/          # Estilos globales y módulos CSS
│   ├── App.jsx          # Componente raíz
│   └── main.jsx         # Punto de entrada
├── public/              # Assets estáticos
├── Dockerfile           # Configuración Docker para producción
├── nginx.conf.template  # Configuración Nginx para producción
├── vite.config.js       # Configuración de Vite
└── package.json         # Dependencias y scripts
```

## Deployment

### Railway (Producción)

Para desplegar en Railway, sigue la guía completa:

📖 **[DEPLOY.md](./DEPLOY.md)** - Guía paso a paso para desplegar en Railway

### ⚠️ Problema Común: Variables de Entorno

Si después del deploy tu app intenta conectar a `localhost:8000` en lugar del backend de Railway:

📖 **[RAILWAY_VITE_ENV_VARS.md](./RAILWAY_VITE_ENV_VARS.md)** - Solución detallada para variables de entorno en Railway

**Resumen del problema:**
- Vite embebe las variables de entorno durante el **build-time**
- Railway inyecta variables de entorno en **runtime**
- Necesitas pasar `VITE_API_URL` como build argument en Docker

**Solución implementada:**
El Dockerfile ya está configurado correctamente con:
```dockerfile
ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=$VITE_API_URL
```

Solo necesitas configurar la variable en Railway.

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [DEPLOY.md](./DEPLOY.md) | Guía completa de deployment en Railway |
| [RAILWAY_VITE_ENV_VARS.md](./RAILWAY_VITE_ENV_VARS.md) | Solución para variables de entorno de Vite en Railway/Docker |
| [.env.example](./.env.example) | Plantilla de variables de entorno |

## Configuración de Producción

### Nginx

El servidor Nginx está configurado con:
- ✅ Compresión Gzip
- ✅ Headers de seguridad
- ✅ Soporte para SPA routing
- ✅ Cache de assets estáticos

Ver: [nginx.conf.template](./nginx.conf.template)

### Docker

Build multi-stage para optimizar el tamaño de la imagen:
- **Stage 1:** Build con Node.js
- **Stage 2:** Servir con Nginx

Ver: [Dockerfile](./Dockerfile)

## Troubleshooting

### La aplicación no carga
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador (F12) para errores
3. Verifica que `VITE_API_URL` apunte a la URL correcta

### Error de CORS
1. Verifica que la URL del frontend esté en `CORS_ORIGINS` del backend
2. Asegúrate de usar HTTPS en producción
3. No uses barras finales en las URLs

### Errores de build
1. Elimina `node_modules` y `package-lock.json`
2. Ejecuta `npm install` nuevamente
3. Verifica que estés usando Node.js 20+

### Variables de entorno no se aplican
Ver la guía completa: [RAILWAY_VITE_ENV_VARS.md](./RAILWAY_VITE_ENV_VARS.md)

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request

## Licencia

Este proyecto es de uso interno del Hospital San Ignacio.

## Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

---

**Última actualización:** Diciembre 2025
