# Guía: crear un módulo con DDD + Clean Architecture + Prisma

Esta guía explica cómo crear un **nuevo módulo** (otra entidad) siguiendo el mismo flujo que `users` y `videos`.

---

## Idea general

Cada módulo tiene **4 capas**. Cada una tiene una responsabilidad clara:

| Capa | Responsabilidad | ¿Conoce la BD? |
|------|-----------------|----------------|
| **Domain** | Reglas de negocio puras | No |
| **Application** | Orquesta el caso de uso | No |
| **Infrastructure** | Guarda/lee en MySQL (Prisma) | Sí |
| **Presentation** | Recibe HTTP y devuelve JSON | No |

### Flujo de una petición `POST /users`

```
Cliente HTTP
    ↓
UserController           ← presentation (recibe el body)
    ↓
CreateUserDto            ← validación HTTP (class-validator)
    ↓
CreateUserUseCase        ← application (lógica del caso de uso)
    ↓
User (entidad dominio)   ← domain (valida reglas de negocio)
    ↓
UserRepository           ← domain (contrato abstracto)
    ↓
PrismaUserRepository     ← infrastructure (implementación real)
    ↓
PrismaService            ← infrastructure (cliente Prisma)
    ↓
prisma/schema.prisma     ← modelo de BD (tabla users)
    ↓
MySQL
    ↓
(vuelve por el mismo camino hasta el JSON de respuesta)
```

---

## Estructura del proyecto

```
server/
├── prisma/
│   └── schema.prisma          ← TODOS los modelos de BD viven aquí
│
├── src/
│   ├── database/
│   │   └── prisma.service.ts  ← Conexión Prisma (compartida)
│   │
│   ├── app.module.ts          ← Conecta controllers, use cases y repos
│   │
│   └── modules/
│       ├── users/
│       │   ├── domain/
│       │   │   ├── entities/user.entity.ts
│       │   │   └── repositories/user.repository.ts
│       │   ├── application/use-cases/create-user.use-case.ts
│       │   ├── infrastructure/persistence/prisma-user.repository.ts
│       │   └── presentation/
│       │       ├── dto/create-user.dto.ts
│       │       └── controllers/user.controller.ts
│       │
│       └── videos/              ← mismo patrón
```

> Con Prisma **no** hay un archivo ORM por módulo. El esquema de BD está centralizado en `prisma/schema.prisma`.

---

## Configuración inicial (una sola vez)

### `.env`

```env
DB_HOST=...
DB_PORT=3306
DB_USERNAME=...
DB_PASSWORD=...
DB_DATABASE=video_studio
DATABASE_URL=mysql://usuario:password@host:3306/video_studio
PORT=3000
```

Prisma usa `DATABASE_URL`. Las demás variables las puedes mantener para otras partes del proyecto.

### `main.ts`

```typescript
import 'dotenv/config';
```

### Comandos Prisma

```bash
# Generar el cliente (después de cambiar schema.prisma)
npm run prisma:generate

# Crear/aplicar migraciones
npm run prisma:migrate

# Ver datos en el navegador
npm run prisma:studio

# Si ya tienes tablas en MySQL y quieres importar el schema
npx prisma db pull
```

> **Importante:** cada vez que modifiques `schema.prisma`, ejecuta `npm run prisma:generate`. Si el editor no reconoce los modelos, reinicia el TS Server (`Ctrl+Shift+P` → *TypeScript: Restart TS Server*).

---

## Paso 1 — Domain: la entidad

**Archivo:** `domain/entities/product.entity.ts`

Aquí viven las **reglas de negocio**. No importes NestJS, Prisma ni nada de base de datos.

```typescript
export class Product {
  constructor(
    public readonly id: number | null,
    public name: string,
    public price: number,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.length < 2) {
      throw new Error('Nombre de producto inválido');
    }
    if (this.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }
  }
}
```

**Regla:** si los datos no cumplen el negocio, la entidad lanza error. Eso pasa **antes** de guardar en la BD.

---

## Paso 2 — Domain: el contrato del repositorio

**Archivo:** `domain/repositories/product.repository.ts`

Define **qué necesita el negocio**, no **cómo** se guarda.

```typescript
import { Product } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract create(product: Product): Promise<Product>;
  // abstract findById(id: number): Promise<Product | null>;
}
```

**Regla:** el dominio solo dice *"alguien debe poder guardar esto"*. No sabe si es Prisma, MySQL directo, etc.

---

## Paso 3 — Application: el caso de uso

**Archivo:** `application/use-cases/create-product.use-case.ts`

Orquesta el flujo: recibe datos, crea la entidad, llama al repositorio.

```typescript
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

export interface CreateProductInput {
  name: string;
  price: number;
}

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const product = new Product(null, input.name, input.price);
    return this.productRepository.create(product);
  }
}
```

**Regla:** el caso de uso **no** habla con Prisma directamente. Solo usa `ProductRepository`.

---

## Paso 4 — Prisma: agregar el modelo en `schema.prisma`

**Archivo:** `prisma/schema.prisma`

Aquí defines la **tabla** en MySQL. Es el único lugar donde vive el esquema de BD.

```prisma
model Product {
  id    Int     @id @default(autoincrement())
  name  String  @db.VarChar(120)
  price Decimal @db.Decimal(10, 2)

  @@map("products")
}
```

Después de agregar el modelo:

```bash
npm run prisma:generate
npm run prisma:migrate
```

**Convención Prisma:** el modelo se escribe en PascalCase (`Product`), pero en código se accede en **minúscula**:

```typescript
prisma.product.create()   // ✅ correcto
prisma.Product.create()   // ❌ error
```

---

## Paso 5 — Infrastructure: repositorio Prisma

**Archivo:** `infrastructure/persistence/prisma-product.repository.ts`

Implementa el contrato del dominio usando Prisma. Traduce entre **entidad de dominio** y **modelo Prisma**.

```typescript
import { PrismaClient } from '@prisma/client';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<Product> {
    const saved = await this.prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
      },
    });

    return new Product(saved.id, saved.name, Number(saved.price));
  }
}
```

**Regla:** usa `PrismaClient` como tipo en el constructor (no `PrismaService`), para que TypeScript reconozca los modelos (`product`, `user`, `video`).

---

## Paso 6 — Presentation: DTO (validación HTTP)

**Archivo:** `presentation/dto/create-product.dto.ts`

```typescript
import { IsNotEmpty, MinLength, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNumber()
  @Min(0.01)
  price: number;
}
```

| Validación | Dónde | Ejemplo |
|------------|-------|---------|
| HTTP / formato | DTO (`class-validator`) | email válido, campo requerido |
| Negocio | Entidad de dominio | precio mayor a 0, reglas propias |

---

## Paso 7 — Presentation: controller

**Archivo:** `presentation/controllers/product.controller.ts`

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const product = await this.createProductUseCase.execute({
      name: dto.name,
      price: dto.price,
    });

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
```

**Regla:** el controller **no** tiene lógica de negocio. Solo traduce HTTP ↔ caso de uso.

---

## Paso 8 — Registrar todo en `app.module.ts`

Cada módulo nuevo hay que **conectarlo** en `app.module.ts`. Sin esto, NestJS no sabe qué inyectar.

### 8.1 Imports

```typescript
import { PrismaService } from './database/prisma.service';

import { ProductController } from './modules/products/presentation/controllers/product.controller';
import { CreateProductUseCase } from './modules/products/application/use-cases/create-product.use-case';
import { ProductRepository } from './modules/products/domain/repositories/product.repository';
import { PrismaProductRepository } from './modules/products/infrastructure/persistence/prisma-product.repository';
```

### 8.2 Module (sin TypeORM)

```typescript
@Module({
  imports: [],
  controllers: [AppController, UserController, VideoController, ProductController],
  providers: [
    AppService,
    PrismaService,

    // --- Users ---
    {
      provide: UserRepository,
      useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository) =>
        new CreateUserUseCase(userRepository),
      inject: [UserRepository],
    },

    // --- Videos ---
    {
      provide: VideoRepository,
      useFactory: (prisma: PrismaService) => new PrismaVideoRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateVideoUseCase,
      useFactory: (videoRepository: VideoRepository) =>
        new CreateVideoUseCase(videoRepository),
      inject: [VideoRepository],
    },

    // --- Products (nuevo módulo) ---
    {
      provide: ProductRepository,
      useFactory: (prisma: PrismaService) => new PrismaProductRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateProductUseCase,
      useFactory: (productRepository: ProductRepository) =>
        new CreateProductUseCase(productRepository),
      inject: [ProductRepository],
    },
  ],
})
export class AppModule {}
```

### ¿Por qué `useFactory`?

Porque `ProductRepository` es una **clase abstracta** (contrato del dominio). NestJS no sabe cuál implementación usar:

```
ProductRepository  →  PrismaProductRepository  →  PrismaService  →  MySQL
CreateProductUseCase →  recibe ProductRepository
```

`PrismaService` solo se registra **una vez** y lo comparten todos los repositorios.

---

## Checklist rápido (nuevo módulo)

- [ ] `prisma/schema.prisma` — agregar modelo + `npm run prisma:generate` + `npm run prisma:migrate`
- [ ] `domain/entities/nombre.entity.ts` — entidad con validaciones
- [ ] `domain/repositories/nombre.repository.ts` — contrato abstracto
- [ ] `application/use-cases/create-nombre.use-case.ts` — caso de uso
- [ ] `infrastructure/persistence/prisma-nombre.repository.ts` — implementación Prisma
- [ ] `presentation/dto/create-nombre.dto.ts` — validación HTTP
- [ ] `presentation/controllers/nombre.controller.ts` — endpoint REST
- [ ] `app.module.ts` — agregar controller + 2 providers (`Repository` + `UseCase`)

---

## Cómo probar

1. `.env` configurado con `DATABASE_URL` y `main.ts` con `import 'dotenv/config'`.
2. `npm run prisma:generate`
3. `npm run start:dev`
4. Prueba con Postman o curl:

```bash
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "johndoe@example.com"
}
```

```bash
POST http://localhost:3000/videos
Content-Type: application/json

{
  "name": "Video prueba",
  "url": "https://ejemplo.com/video.mp4"
}
```

---

## Reglas de oro

1. **Domain no importa NestJS ni Prisma.**
2. **Application solo usa contratos del domain** (`XxxRepository`, entidades).
3. **Infrastructure implementa los contratos** con `PrismaClient`.
4. **Presentation solo recibe/envía HTTP** y llama casos de uso.
5. **`schema.prisma` es la única fuente de verdad** para tablas y columnas.
6. **Un caso de uso = una acción** (`create`, `update`, `delete` → un archivo por acción).
7. **En código, los modelos Prisma van en minúscula:** `prisma.user`, `prisma.video`.

---

## Referencia: módulos implementados

### `users`

| Archivo | Qué hace |
|---------|----------|
| `user.entity.ts` | Valida name y email |
| `user.repository.ts` | Contrato `create()` |
| `create-user.use-case.ts` | Crea `User` y lo guarda |
| `prisma-user.repository.ts` | Guarda con `prisma.user.create()` |
| `create-user.dto.ts` | Valida body HTTP |
| `user.controller.ts` | `POST /users` |

### `videos`

| Archivo | Qué hace |
|---------|----------|
| `video.entity.ts` | Valida name y url |
| `video.repository.ts` | Contrato `create()` |
| `create-video.use-case.ts` | Crea `Video` y lo guarda |
| `prisma-video.repository.ts` | Guarda con `prisma.video.create()` |
| `create-video.dto.ts` | Valida body HTTP |
| `video.controller.ts` | `POST /videos` |

### Archivos compartidos

| Archivo | Qué hace |
|---------|----------|
| `prisma/schema.prisma` | Modelos `User`, `Video`, etc. |
| `src/database/prisma.service.ts` | Conexión a MySQL via Prisma |

---

## TypeORM → Prisma: qué cambió

| Antes (TypeORM) | Ahora (Prisma) |
|-----------------|----------------|
| `user-orm-entity.ts` por módulo | Modelo en `prisma/schema.prisma` |
| `typeorm-user.repository.ts` | `prisma-user.repository.ts` |
| `TypeOrmModule.forRoot()` | `PrismaService` en providers |
| `TypeOrmModule.forFeature()` | No necesario |
| `getRepositoryToken()` | Inyectar `PrismaService` |
| Migraciones TypeORM | `npm run prisma:migrate` |
