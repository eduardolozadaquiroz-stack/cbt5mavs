# CBT Núm. 5 – Portal Escolar

Portal escolar completo para el Centro de Bachillerato Tecnológico Núm. 5, Chalco.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 (App Router), React 18, Tailwind CSS |
| Backend | API Routes (Edge Runtime), Supabase SSR |
| Base de datos | PostgreSQL (Supabase) con RLS |
| Auth | Supabase Auth (JWT + cookies HttpOnly) |
| Deploy | Cloudflare Pages (open-next) |
| Testing | Vitest (unit), Playwright (E2E) |
| Monitoreo | Sentry (error tracking) |

## Requisitos

- Node.js >= 20.0.0, < 24.0.0
- npm >= 10
- Proyecto de Supabase activo

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd cbt-nextjs

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores de tu proyecto Supabase

# 4. Ejecutar migraciones de BD
# En Supabase Dashboard → SQL Editor, ejecutar en orden:
#   database/schema.sql
#   database/rls-policies.sql
#   database/views-functions.sql
#   database/improvements.sql

# 5. Iniciar servidor de desarrollo
npm run dev
```

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública anon de Supabase | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service_role (solo servidor) | Sí |
| `NEXT_PUBLIC_APP_URL` | URL pública base del portal, sin slash final | Sí |
| `SMTP_HOST` | Host SMTP, para Gmail usa `smtp.gmail.com` | Sí |
| `SMTP_PORT` | Puerto SMTP, para Gmail se recomienda `465` | Sí |
| `SMTP_SECURE` | TLS implícito, usa `true` con puerto `465` | Sí |
| `SMTP_USER` | Cuenta Gmail remitente | Sí |
| `SMTP_PASS` | Contraseña de aplicación de Gmail, no la contraseña normal | Sí |
| `EMAIL_FROM` | Remitente, ej. `CBT Num. 5 <tu_correo@gmail.com>` | Sí |
| `EMAIL_REPLY_TO` | Correo de respuesta o soporte | No |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN de Sentry para error tracking | No |

Los correos de activación y recuperación se generan con enlaces seguros de Supabase Auth, pero el envío lo hace el proyecto mediante Gmail SMTP. En Cloudflare configura `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_REPLY_TO` y `SUPABASE_SERVICE_ROLE_KEY` como secrets. Para Gmail usa una contraseña de aplicación.

## Scripts

```bash
npm run dev          # Servidor de desarrollo (localhost:3000)
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # ESLint
npm run test         # Tests unitarios (Vitest)
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
npm run test:e2e     # Tests E2E (Playwright)
npm run deploy:cf    # Deploy a Cloudflare Pages
```

## Arquitectura

```
cbt-nextjs/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes (CRUD, auth)
│   ├── dashboard/          # Dashboards por rol
│   │   ├── administrador/
│   │   ├── alumno/
│   │   ├── maestro/
│   │   └── padres/
│   ├── login/
│   └── layout.tsx          # Layout raíz
├── components/             # Componentes React
│   ├── dashboard/          # Componentes de dashboards
│   ├── layout/             # Navbar, Footer, etc.
│   └── sections/           # Secciones del landing
├── lib/                    # Utilidades del servidor
│   ├── api-response.ts     # Helpers de respuesta API
│   ├── auth.ts             # Autenticación server-side
│   ├── schemas.ts          # Schemas Zod de validación
│   ├── rate-limit.ts       # Rate limiter (KV + memory)
│   ├── validate.ts         # Validaciones legacy
│   ├── supabase*.ts        # Clientes Supabase
│   ├── logger.ts           # Logger estructurado
│   ├── i18n.ts             # Internacionalización
│   └── a11y.ts             # Helpers de accesibilidad
├── hooks/                  # Custom React hooks (realtime)
├── database/               # Scripts SQL
│   ├── schema.sql          # Tablas y tipos
│   ├── rls-policies.sql    # Row Level Security
│   ├── views-functions.sql # Vistas y funciones
│   └── improvements.sql    # Índices, triggers, optimizaciones
├── __tests__/              # Tests unitarios
├── e2e/                    # Tests E2E (Playwright)
├── middleware.ts            # Middleware de seguridad
└── sentry.*.config.ts      # Configuración Sentry
```

## Roles y Permisos

| Rol | Acceso |
|-----|--------|
| **Admin** | CRUD total, reportes, configuración, auditoría |
| **Maestro** | Calificaciones, asistencias, avisos propios, carga académica |
| **Alumno** | Calificaciones propias, asistencias, horarios, reinscripción |
| **Padres** | Calificaciones/asistencias de hijos vinculados |

## Seguridad

- **OWASP Top 10** mitigaciones implementadas:
  - CSP con nonce (no `unsafe-inline` para scripts)
  - Rate limiting con Cloudflare KV
  - Validación de inputs con Zod
  - RLS en todas las tablas sensibles
  - Cookies HttpOnly + Secure + SameSite
  - Audit log automático
- **Sentry** para error tracking en producción

## Testing

```bash
# Tests unitarios
npm run test

# Tests unitarios con cobertura
npm run test:coverage

# Tests E2E (requiere servidor corriendo)
npm run test:e2e
```

## Base de Datos

### Tablas principales
- `usuarios` – Identidad central (SSO con Supabase Auth)
- `alumnos`, `maestros`, `padres_tutores` – Extensiones por rol
- `carreras`, `materias`, `grupos` – Catálogos académicos
- `calificaciones`, `asistencias` – Datos académicos
- `avisos` – Comunicados institucionales
- `admision_solicitudes` – Pipeline de admisión

### Optimizaciones
- Índices compuestos para queries frecuentes
- Triggers de auditoría genéricos
- Actualización automática de promedios
- Funciones para reportes (boleta, horario, etc.)

## Deploy

### Cloudflare Pages

```bash
npm run deploy:cf
```

Requiere tener `wrangler` configurado con tu cuenta de Cloudflare.

## Contribuir

1. Crear rama desde `develop`
2. Hacer cambios con tests
3. Ejecutar `npm run lint && npm run test`
4. Crear Pull Request

## Licencia

Propietario – CBT Núm. 5, Chalco.
