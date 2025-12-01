# CertiWeb - Sistema de Certificación y Venta de Vehículos

[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://certi-web-front.vercel.app)
[![CI/CD Pipeline](https://github.com/Diseno-Experimentos/CertiWeb-Front/actions/workflows/vercel-deploy.yml/badge.svg)](https://github.com/Diseno-Experimentos/CertiWeb-Front/actions)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite)](https://vitejs.dev/)

Plataforma web moderna para la gestión integral de certificaciones vehiculares, reservas de inspección y comercialización de vehículos certificados.

## Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Problema que Resuelve](#problema-que-resuelve)
- [Arquitectura y Bounded Contexts](#arquitectura-y-bounded-contexts)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Pruebas](#pruebas)
- [Despliegue](#despliegue)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Descripción del Proyecto

CertiWeb es una aplicación web completa diseñada para revolucionar el proceso de certificación y venta de vehículos usados. La plataforma conecta a propietarios de vehículos, compradores potenciales y administradores en un ecosistema digital que garantiza transparencia, confianza y eficiencia en cada transacción.

### Visión del Proyecto

Crear un marketplace de confianza donde cada vehículo cuente con una certificación técnica verificada, permitiendo transacciones seguras y transparentes entre compradores y vendedores.

## Problema que Resuelve

### Problemáticas Identificadas

1. **Falta de Transparencia en Vehículos Usados**

   - Los compradores enfrentan incertidumbre sobre el estado real del vehículo
   - Información técnica poco confiable o inexistente
   - Riesgo de fraude y ocultación de fallas mecánicas

2. **Proceso de Certificación Complejo**

   - Procedimientos engorrosos y poco digitalizados
   - Falta de trazabilidad en el historial de inspecciones
   - Dificultad para agendar y gestionar citas de certificación

3. **Desconfianza en el Mercado de Usados**
   - Compradores reacios por experiencias negativas previas
   - Vendedores sin forma de validar la calidad de sus vehículos
   - Ausencia de un estándar de certificación reconocido

### Solución Propuesta

CertiWeb digitaliza y centraliza todo el proceso mediante:

- Certificación Digital: Sistema completo de inspección vehicular con reportes detallados
- Gestión de Reservas: Agendamiento inteligente de citas de inspección
- Marketplace Verificado: Catálogo de vehículos con certificaciones validadas
- Sistema Multi-rol: Interfaces diferenciadas para usuarios, administradores y compradores
- Trazabilidad Completa: Historial completo de certificaciones y mantenimientos

## Arquitectura y Bounded Contexts

El proyecto sigue principios de Domain-Driven Design (DDD) con una clara separación de contextos acotados:

### Certification Context (Contexto de Certificación)

**Responsabilidad**: Gestión del ciclo de vida de certificaciones vehiculares

**Entidades Principales**:

- `Car`: Representa un vehículo con sus datos técnicos y certificación
- `Reservation`: Reserva de cita para inspección técnica

**Servicios**:

- `carService`: CRUD de vehículos y certificaciones
- `reservationService`: Gestión de citas de inspección

**Componentes**:

- `admin-certification`: Panel administrativo de certificaciones
- `reservation`: Sistema de agendamiento de inspecciones
- `dashboard`: Vista general de certificaciones activas

**Casos de Uso**:

- Crear nueva certificación vehicular
- Agendar inspección técnica
- Aprobar/rechazar certificaciones
- Subir documentación e imágenes técnicas

### User Management Context (Contexto de Usuarios)

**Responsabilidad**: Autenticación, autorización y perfil de usuarios

**Entidades Principales**:

- `User`: Usuario del sistema (propietario, comprador, administrador)

**Servicios**:

- `authService`: Login, registro y gestión de sesiones
- `userService`: Operaciones sobre datos de usuario

**Componentes**:

- `login`: Autenticación de usuarios
- `register`: Registro de nuevos usuarios
- `profile`: Gestión de perfil personal

**Casos de Uso**:

- Registro de nuevos usuarios
- Login con diferentes roles (user/admin)
- Gestión de perfil y preferencias
- Recuperación de contraseña

### Marketplace Context (Contexto de Comercialización)

**Responsabilidad**: Catálogo y visualización de vehículos certificados

**Componentes**:

- `car-list`: Catálogo de vehículos disponibles
- `car-detail`: Vista detallada de cada vehículo
- `history`: Historial de transacciones y certificaciones

**Casos de Uso**:

- Explorar catálogo de vehículos certificados
- Ver detalles técnicos y certificaciones
- Filtrar y buscar vehículos
- Consultar historial de certificaciones

### Shared Context (Contexto Compartido)

**Responsabilidad**: Servicios y utilidades transversales

**Servicios**:

- `baseService`: Cliente HTTP base con interceptores
- `imgbbService`: Integración con API de almacenamiento de imágenes
- `historyService`: Gestión de historial de operaciones

**Infraestructura**:

- Configuración de axios
- Gestión de variables de entorno
- Internacionalización (i18n)

## Características Principales

### Para Usuarios (Propietarios)

- Registro de Vehículos: Alta de vehículos con datos técnicos completos
- Carga de Imágenes: Integración con ImgBB para almacenamiento de fotos
- Reserva de Inspecciones: Agendamiento de citas para certificación
- Dashboard Personal: Vista unificada de vehículos y certificaciones
- Historial Completo: Registro de todas las operaciones realizadas

### Para Administradores

- Gestión de Certificaciones: Aprobar o rechazar solicitudes de certificación
- Panel Administrativo: Vista completa de todas las certificaciones
- Gestión de Usuarios: Administración de cuentas y roles
- Reportes y Métricas: Estadísticas del sistema

### Para Compradores

- Catálogo Verificado: Navegación de vehículos con certificación válida
- Detalles Técnicos: Información completa de cada vehículo
- Certificación Visible: Validación del estado técnico del vehículo
- Información de Contacto: Datos del vendedor

### Características Técnicas

- Autenticación JWT: Sistema seguro de sesiones
- Multi-idioma: Soporte para español e inglés (i18n)
- Responsive Design: Adaptado a todos los dispositivos
- Accesibilidad: Diseño inclusivo con PrimeVue
- UI/UX Moderna: Interfaz intuitiva y atractiva
- Performance: Optimizado con Vite y lazy loading
- Testing Completo: Tests unitarios, integración y E2E

## Tecnologías Utilizadas

### Frontend Core

- **[Vue 3](https://vuejs.org/)** - Framework JavaScript progresivo
- **[Vite](https://vitejs.dev/)** - Build tool y dev server ultrarrápido
- **[Vue Router](https://router.vuejs.org/)** - Routing oficial de Vue

### UI & Styling

- **[PrimeVue](https://primevue.org/)** - Biblioteca de componentes UI
- **[PrimeIcons](https://primevue.org/icons)** - Iconografía consistente

### State & API

- **[Axios](https://axios-http.com/)** - Cliente HTTP con interceptores
- **[Vue I18n](https://vue-i18n.intlify.dev/)** - Internacionalización

### Testing

- **[Vitest](https://vitest.dev/)** - Framework de testing ultrarrápido
- **[Vue Test Utils](https://test-utils.vuejs.org/)** - Utilidades de testing para Vue
- **[@testing-library/vue](https://testing-library.com/vue)** - Testing centrado en el usuario

### DevOps y CI/CD

- Docker - Containerización
- Vercel - Hosting y deployment
- GitHub Actions - Pipeline de CI/CD
- Nginx - Servidor web para producción

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Diseno-Experimentos/CertiWeb-Front.git
cd CertiWeb-Front

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run preview          # Preview de producción

# Build
npm run build            # Build para producción
npm run build:prod       # Build explícito de producción

# Testing
npm test                 # Tests en modo watch
npm run test:unit        # Tests unitarios
npm run test:integration # Tests de integración
npm run test:coverage    # Coverage report

# Calidad
npm run lint             # Verificar linting
npm run lint:fix         # Auto-fix linting
npm run format           # Formatear código

# Docker
npm run docker:build     # Build imagen Docker
npm run docker:run       # Run container

# Vercel
npm run vercel:deploy    # Deploy a producción
npm run vercel:preview   # Deploy preview
```

## Pruebas

```bash
# Tests unitarios
npm run test:unit

# Tests de integración con backend
npm run test:integration

# Coverage completo
npm run test:coverage
```

Cobertura: Más de 30 tests entre unitarios, integración y E2E

## Despliegue

### Despliegue Automático (CI/CD)

- **Push a `main`**: Deploy automático a producción
- **Pull Request**: Deploy de preview con URL única
- **Push a `develop`**: Build y tests (sin deploy)

### Despliegue Manual

```bash
# Vercel
vercel --prod

# Docker
npm run docker:build && npm run docker:run
```

Ver la guía completa en [`VERCEL-DEPLOYMENT.md`](./VERCEL-DEPLOYMENT.md)

## Estructura del Proyecto

```md
CertiWeb-Front/
├── src/
│ ├── certifications/ # Certification Context
│ │ ├── components/
│ │ ├── model/
│ │ └── services/
│ ├── public/ # User Management & Marketplace
│ │ ├── components/
│ │ ├── pages/
│ │ └── services/
│ ├── shared/ # Shared Context
│ │ └── services/
│ ├── config/ # Configuración
│ ├── environments/ # Variables de entorno
│ ├── router/ # Routing
│ └── tests/ # Tests
├── .github/workflows/ # CI/CD
├── Dockerfile
├── vercel.json
└── package.json
```

---

## Documentación

- [Deploy en Vercel](./VERCEL-DEPLOYMENT.md)
- [Quickstart Vercel](./QUICKSTART-VERCEL.md)
- [CI/CD Summary](./CI-CD-SUMMARY.md)
- [Production Checklist](./PRODUCTION-CHECKLIST.md)

## Enlaces

- **App**: <https://certi-web-front.vercel.app>
- **Backend**: <https://certiweb-backend.onrender.com/api/v1>
- **Repo**: <https://github.com/Diseno-Experimentos/CertiWeb-Front>

---

Desarrollado con Vue 3 + Vite | Desplegado en Vercel | Tests Completos
