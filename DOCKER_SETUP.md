# 🐳 Docker Setup Guide - FRINDER

## ✅ Requisitos Previos

Asegúrate de tener:
- Docker Desktop instalado (Windows/Mac) o Docker CE + Docker Compose (Linux)
- Puertos disponibles: 3000 (frontend), 5000 (backend), 27017 (MongoDB)

## 🚀 Despliegue Rápido (La Primera Vez)

```bash
# 1. Navega al directorio del proyecto
cd FRINDER-1.0_Funcional

# 2. Limpia cualquier construcción anterior (IMPORTANTE en primera instalación)
npm run docker:clean

# 3. Construye las imágenes sin cache
npm run docker:build

# 4. Levanta los servicios
npm run docker:up

# 5. Verifica que todo esté corriendo
docker compose ps
```

## 📱 Acceso a la Aplicación

Una vez que todo está levantado:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017 (interno)

## 🔍 Verificar Salud de los Servicios

```bash
# Ver el estado de todos los servicios
docker compose ps

# Ver logs en tiempo real
npm run docker:logs

# Ver logs de un servicio específico
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f mongodb
```

## 🛠️ Troubleshooting

### El build falla con "vite: not found"
✅ **Solución**: Asegúrate de que npm esté instalando todas las dependencias (incluyendo devDependencies)
```bash
npm run docker:clean
npm run docker:build
```

### El contenedor se cuelga o tarda mucho
✅ **Solución**: Los healthchecks iniciales pueden tardar 30-45 segundos. Espera pacientemente.
```bash
docker compose ps  # Vigila el estado
```

### Puerto ya en uso
✅ **Solución**: Encuentra y mata los procesos en los puertos
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### MongoDB no se conecta
✅ **Solución**: Reinicia todos los servicios
```bash
npm run docker:down
npm run docker:clean
npm run docker:up
```

### Cambiar el código - ¿Cómo recompilo?
✅ **Solución**: Rebuilding con cache:
```bash
# Sin eliminar datos (más rápido)
docker compose build
docker compose up -d

# Con limpieza total
npm run docker:clean
npm run docker:build
npm run docker:up
```

## 📋 Scripts Disponibles

```bash
npm run docker:build    # Construye sin cache (primera vez)
npm run docker:up       # Levanta servicios
npm run docker:down     # Detiene servicios
npm run docker:logs     # Ve logs en tiempo real
npm run docker:clean    # Limpia todo (contenedores + volúmenes)
```

## 🔐 Variables de Entorno

El archivo `.env.example` contiene las variables necesarias. En Docker Compose están hardcodeadas en `docker-compose.yml`:
- `PORT=5000` (backend)
- `MONGODB_URI=mongodb://mongodb:27017/frinder`
- `NODE_ENV=production`

Si necesitas cambiar algo, edita `docker-compose.yml` directamente.

## 📊 Healthy Status Esperado

Cuando ejecutas `docker compose ps`, deberías ver:

```
NAME                    STATUS
frinder-mongodb         Up X seconds (healthy)
frinder-backend         Up X seconds (healthy)
frinder-frontend        Up X seconds (healthy)
```

Si alguno dice "unhealthy", revisa los logs:
```bash
docker compose logs <nombre_servicio>
```

## 🚨 En Caso de Emergencia

Si algo se rompe completamente:
```bash
npm run docker:clean    # Nuclear option - elimina todo
npm run docker:build    # Reconstruye desde cero
npm run docker:up       # Levanta nuevamente
```

---

**Nota**: Los healthchecks en Docker pueden tardar hasta 2 minutos en completarse. El estado de "starting" es normal durante este tiempo.