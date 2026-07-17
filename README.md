# 🍽️ MenuDays API

Backend oficial de **MenuDays**, desarrollado con **NestJS**, **Prisma ORM** y **PostgreSQL**.

El proyecto sigue una arquitectura modular basada en capas para garantizar escalabilidad, mantenibilidad y facilidad de integración con el frontend.

---

# 🚀 Tecnologías

| Tecnología | Uso |
|------------|-----|
| NestJS | Framework Backend |
| TypeScript | Lenguaje principal |
| Prisma ORM | ORM |
| PostgreSQL | Base de Datos |
| JWT | Autenticación |
| Bcrypt | Hash de contraseñas |
| Swagger | Documentación API |
| Railway | Deploy |
| Cloudinary | Almacenamiento de imágenes |

---

# 🏗 Arquitectura

El proyecto sigue una arquitectura modular.

Cada módulo representa un requerimiento funcional del sistema.

```
Controller
      │
      ▼
 Service
      │
      ▼
 Prisma ORM
      │
      ▼
 PostgreSQL
```

Cada módulo es independiente y contiene toda su lógica.

---

# 📂 Estructura del Proyecto

```
src
│
├── core
│   ├── common
│   ├── config
│   ├── constants
│   └── database
│
└── modules
    ├── auth
    ├── users
    ├── locations
    ├── restaurants
    ├── restaurant-requests
    ├── menus
    ├── dishes
    ├── categories
    ├── reviews
    ├── favorites
    ├── notifications
    ├── reports
    └── ...
```

---

# 📦 Estructura de un módulo

Todos los módulos deben mantener la misma estructura.

```
modules
└── nombre-del-modulo
    │
    ├── controllers
    │      nombre.controller.ts
    │
    ├── services
    │      nombre.service.ts
    │
    ├── dto
    │
    ├── entities
    │
    ├── interfaces
    │
    ├── guards
    │
    └── nombre.module.ts
```

---

# 📌 Responsabilidad de cada carpeta

## controllers/

Reciben las solicitudes HTTP.

Responsabilidades:

- Definir endpoints.
- Validar parámetros.
- Llamar al Service.
- Devolver respuestas.

No contienen lógica de negocio.

---

## services/

Contienen toda la lógica de negocio.

Responsabilidades:

- Validaciones.
- Reglas de negocio.
- Consultas con Prisma.
- Excepciones.
- Integraciones.

Es la capa más importante del proyecto.

---

## dto/

Objetos utilizados para validar datos de entrada.

Ejemplos:

- CreateUserDto
- UpdateProfileDto
- LoginDto

Se utilizan junto con:

- class-validator
- class-transformer

---

## entities/

Representan las respuestas del módulo.

Actualmente son opcionales ya que Prisma devuelve objetos tipados.

---

## interfaces/

Interfaces compartidas por el módulo.

Ejemplo:

- JwtPayload
- RestaurantFilters
- UserLocation

---

## guards/

Protección de rutas.

Ejemplos:

- JwtAuthGuard
- RolesGuard

---

## module.ts

Registra:

- Controllers
- Services
- Imports
- Providers

---

# 🗄 Base de Datos

Motor:

```
PostgreSQL
```

ORM:

```
Prisma ORM
```

Ubicación del esquema:

```
prisma/schema.prisma
```

---

# 🌱 Seed

Los datos iniciales se encuentran en:

```
prisma/

├── seed.ts
└── seeds/
```

Ejemplos:

- Provincias
- Ciudades
- Categorías
- Administrador

---

# 📖 Swagger

Una vez iniciado el proyecto:

```
http://localhost:3000/api
```

Toda la documentación de endpoints se genera automáticamente.

---

# ▶ Ejecutar el proyecto

## Instalar dependencias

```bash
npm install
```

---

## Ejecutar en desarrollo

```bash
npm run start:dev
```

---

## Compilar

```bash
npm run build
```

---

## Ejecutar producción

```bash
npm run start:prod
```

---

# 🗄 Prisma

## Generar cliente

```bash
npx prisma generate
```

---

## Crear migración

```bash
npx prisma migrate dev --name nombre_migracion
```

---

## Aplicar migraciones

```bash
npx prisma migrate deploy
```

---

## Ejecutar Seed

```bash
npx prisma db seed
```

---

## Abrir Prisma Studio

```bash
npx prisma studio
```

---

## Validar esquema

```bash
npx prisma validate
```

---

## Formatear schema

```bash
npx prisma format
```

---

# 🐘 PostgreSQL

Abrir pgAdmin o utilizar psql.

Consultas útiles:

```sql
SELECT * FROM usuarios;
```

```sql
SELECT * FROM restaurantes;
```

```sql
SELECT * FROM provincias;
```

```sql
SELECT * FROM ciudades;
```

---

# 📋 Flujo de desarrollo

Cada requerimiento funcional sigue el mismo flujo:

```
Endpoint

↓

Controller

↓

DTO

↓

Service

↓

Prisma

↓

PostgreSQL
```

---

# 📌 Convenciones

- Un módulo por funcionalidad.
- Toda la lógica de negocio va en Services.
- Controllers sin lógica.
- DTOs para validaciones.
- Prisma únicamente desde Services.
- Código tipado con TypeScript.
- Arquitectura modular.
- Principios SOLID.
- Clean Code.

---

# 📅 Metodología

El desarrollo se organiza mediante Sprints semanales.

Cada Sprint entrega un flujo funcional completo, permitiendo que el frontend pueda integrarse progresivamente y que el cliente pueda probar funcionalidades reales.

Se prioriza:

- Endpoints REST
- Reglas de negocio
- Validaciones
- Seguridad
- Integración con frontend
- Escalabilidad
- Mantenibilidad

---

# 👨‍💻 Equipo

Proyecto desarrollado utilizando metodología ágil, arquitectura modular y buenas prácticas de desarrollo Backend.