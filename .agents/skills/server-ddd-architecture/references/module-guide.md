# Guía detallada: módulo DDD + Prisma

Referencia extendida basada en `server/readmi.md`. Consultar cuando necesites ejemplos completos o contexto de migración TypeORM → Prisma.

## Estructura del proyecto

```
server/
├── prisma/
│   └── schema.prisma          ← TODOS los modelos de BD
├── src/
│   ├── database/
│   │   └── prisma.service.ts  ← Conexión Prisma (compartida)
│   ├── app.module.ts          ← Controllers, use cases y repos
│   └── modules/
│       ├── users/
│       ├── videos/
│       └── templates/         ← mismo patrón para cada entidad
```

## Configuración inicial

### `.env`

```env
DATABASE_URL=mysql://usuario:password@host:3306/video_studio
PORT=3000
```

Prisma usa `DATABASE_URL`. `main.ts` debe incluir `import 'dotenv/config';`.

### Comandos

```bash
npm run prisma:generate   # Tras cambiar schema.prisma
npm run prisma:migrate    # Crear/aplicar migraciones
npm run prisma:studio     # UI para ver datos
npx prisma db pull        # Importar schema desde MySQL existente
```

---

## Paso 1 — Domain: entidad

**Archivo:** `domain/entities/product.entity.ts`

- Sin imports de NestJS, Prisma ni BD
- Validaciones de negocio en constructor o método privado
- Lanza `Error` si los datos no cumplen reglas

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

---

## Paso 2 — Domain: contrato repositorio

**Archivo:** `domain/repositories/product.repository.ts`

- Clase **abstracta** (no interfaz, para inyección NestJS)
- Define qué necesita el negocio, no cómo se persiste

```typescript
import { Product } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract create(product: Product): Promise<Product>;
  // abstract findById(id: number): Promise<Product | null>;
}
```

---

## Paso 3 — Application: caso de uso

**Archivo:** `application/use-cases/create-product.use-case.ts`

- Recibe input tipado (`CreateXxxInput`)
- Instancia la entidad (dispara validación de dominio)
- Delega persistencia al repositorio abstracto

```typescript
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

export interface CreateProductInput {
  name: string;
  price: number;
}

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const product = new Product(null, input.name, input.price);
    return this.productRepository.create(product);
  }
}
```

---

## Paso 4 — Prisma: modelo en schema

**Archivo:** `prisma/schema.prisma`

```prisma
model Product {
  id    Int     @id @default(autoincrement())
  name  String  @db.VarChar(120)
  price Decimal @db.Decimal(10, 2)

  @@map("products")
}
```

Convención: modelo PascalCase en schema, acceso camelCase en código:

```typescript
prisma.product.create()   // ✅
prisma.Product.create()   // ❌
```

---

## Paso 5 — Infrastructure: repositorio Prisma

**Archivo:** `infrastructure/persistence/prisma-product.repository.ts`

- Implementa el contrato del dominio
- Constructor tipado con `PrismaClient` (no `PrismaService`)
- Traduce entre entidad de dominio y modelo Prisma

```typescript
import { PrismaClient } from '@prisma/client';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';

export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<Product> {
    const saved = await this.prisma.product.create({
      data: { name: product.name, price: product.price },
    });
    return new Product(saved.id, saved.name, Number(saved.price));
  }
}
```

---

## Paso 6 — Presentation: DTO

**Archivo:** `presentation/dto/create-product.dto.ts`

| Validación | Dónde | Ejemplo |
|------------|-------|---------|
| HTTP / formato | DTO (`class-validator`) | email válido, campo requerido |
| Negocio | Entidad de dominio | precio > 0, reglas propias |

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

---

## Paso 7 — Presentation: controller

**Archivo:** `presentation/controllers/product.controller.ts`

- Sin lógica de negocio
- Mapea DTO → input del caso de uso
- Devuelve JSON plano (no la entidad cruda si tiene lógica interna)

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';

@Controller('products')
export class ProductController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const product = await this.createProductUseCase.execute({
      name: dto.name,
      price: dto.price,
    });
    return { id: product.id, name: product.name, price: product.price };
  }
}
```

---

## Paso 8 — app.module.ts

```typescript
import { PrismaService } from './database/prisma.service';
import { ProductController } from './modules/products/presentation/controllers/product.controller';
import { CreateProductUseCase } from './modules/products/application/use-cases/create-product.use-case';
import { ProductRepository } from './modules/products/domain/repositories/product.repository';
import { PrismaProductRepository } from './modules/products/infrastructure/persistence/prisma-product.repository';

@Module({
  imports: [],
  controllers: [AppController, UserController, VideoController, ProductController],
  providers: [
    AppService,
    PrismaService,
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

### Cadena de inyección

```
ProductRepository  →  PrismaProductRepository  →  PrismaService  →  MySQL
CreateProductUseCase  →  recibe ProductRepository
```

---

## Módulos implementados

### users

| Archivo | Responsabilidad |
|---------|-----------------|
| `user.entity.ts` | Valida name y email |
| `user.repository.ts` | Contrato `create()` |
| `create-user.use-case.ts` | Crea `User` y lo guarda |
| `prisma-user.repository.ts` | `prisma.user.create()` |
| `create-user.dto.ts` | Validación HTTP |
| `user.controller.ts` | `POST /users` |

### videos

| Archivo | Responsabilidad |
|---------|-----------------|
| `video.entity.ts` | Valida name y url |
| `video.repository.ts` | Contrato `create()` |
| `create-video.use-case.ts` | Crea `Video` y lo guarda |
| `prisma-video.repository.ts` | `prisma.video.create()` |
| `create-video.dto.ts` | Validación HTTP |
| `video.controller.ts` | `POST /videos` |

### templates

| Archivo | Responsabilidad |
|---------|-----------------|
| `template.entity.ts` | Valida name y content |
| `template.repository.ts` | Contrato `create()` |
| `create-template.use-case.ts` | Crea `Template` y lo guarda |
| `prisma-template.repository.ts` | `prisma.template.create()` |
| `create-template.dto.ts` | Validación HTTP |
| `template.controller.ts` | `POST /templates` |

---

## TypeORM → Prisma (legacy)

| Antes (TypeORM) | Ahora (Prisma) |
|-----------------|----------------|
| `user-orm-entity.ts` por módulo | Modelo en `prisma/schema.prisma` |
| `typeorm-user.repository.ts` | `prisma-user.repository.ts` |
| `TypeOrmModule.forRoot()` | `PrismaService` en providers |
| `TypeOrmModule.forFeature()` | No necesario |
| `getRepositoryToken()` | Inyectar `PrismaService` |
| Migraciones TypeORM | `npm run prisma:migrate` |

---

## Probar endpoints

```bash
POST http://localhost:3000/users
Content-Type: application/json
{ "name": "John Doe", "email": "johndoe@example.com" }

POST http://localhost:3000/videos
Content-Type: application/json
{ "name": "Video prueba", "url": "https://ejemplo.com/video.mp4" }
```
