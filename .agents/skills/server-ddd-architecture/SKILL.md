---
name: server-ddd-architecture
description: >-
  Guía la estructura de código del backend NestJS con DDD, Clean Architecture
  y Prisma en Video Studio IA. Usar al crear módulos, entidades, casos de uso,
  repositorios, controllers, DTOs, schema Prisma o al registrar providers en
  app.module.ts. También al revisar si el código respeta las capas del dominio.
---

# Arquitectura del servidor (DDD + Clean Architecture + Prisma)

Este skill define **cómo estructurar código nuevo** en `server/`. Sigue el patrón de los módulos `users`, `videos` y `templates`.

## Cuándo aplicar

- Crear un módulo o entidad nueva
- Añadir endpoints, casos de uso o repositorios
- Modificar `prisma/schema.prisma`
- Registrar dependencias en `app.module.ts`
- Revisar si un cambio viola las capas

## Las 4 capas

| Capa | Carpeta | Responsabilidad | ¿Conoce BD? |
|------|---------|-----------------|-------------|
| **Domain** | `domain/` | Reglas de negocio puras | No |
| **Application** | `application/` | Orquesta casos de uso | No |
| **Infrastructure** | `infrastructure/` | Persistencia con Prisma | Sí |
| **Presentation** | `presentation/` | HTTP (controllers + DTOs) | No |

### Flujo de una petición

```
HTTP → Controller → DTO → UseCase → Entity → Repository (abstracto)
  → PrismaRepository → PrismaService → schema.prisma → MySQL
```

## Estructura de un módulo

```
server/src/modules/{nombre}/
├── domain/
│   ├── entities/{nombre}.entity.ts
│   └── repositories/{nombre}.repository.ts
├── application/use-cases/create-{nombre}.use-case.ts
├── infrastructure/persistence/prisma-{nombre}.repository.ts
└── presentation/
    ├── dto/create-{nombre}.dto.ts
    └── controllers/{nombre}.controller.ts
```

**Archivos compartidos (no por módulo):**
- `server/prisma/schema.prisma` — única fuente de verdad del esquema
- `server/src/database/prisma.service.ts` — conexión Prisma compartida
- `server/src/app.module.ts` — registro de controllers y providers

## Reglas de oro

1. **Domain** no importa NestJS ni Prisma.
2. **Application** solo usa contratos del domain (`XxxRepository`, entidades).
3. **Infrastructure** implementa contratos con `PrismaClient` (tipo del constructor, no `PrismaService`).
4. **Presentation** solo traduce HTTP ↔ casos de uso; sin lógica de negocio.
5. **`schema.prisma`** centraliza todos los modelos; no hay ORM por módulo.
6. **Un caso de uso = una acción** (`create`, `update`, `delete` → un archivo cada uno).
7. **Modelos Prisma en minúscula:** `prisma.user`, `prisma.video`, `prisma.template`.
8. **Validación en dos niveles:**
   - HTTP/formato → DTO con `class-validator`
   - Negocio → entidad de dominio (lanza `Error` antes de persistir)

## Workflow: nuevo módulo

Copia este checklist y márcalo al implementar:

```
- [ ] 1. schema.prisma — modelo + npm run prisma:generate + npm run prisma:migrate
- [ ] 2. domain/entities/{nombre}.entity.ts — validaciones de negocio
- [ ] 3. domain/repositories/{nombre}.repository.ts — clase abstracta
- [ ] 4. application/use-cases/create-{nombre}.use-case.ts
- [ ] 5. infrastructure/persistence/prisma-{nombre}.repository.ts
- [ ] 6. presentation/dto/create-{nombre}.dto.ts
- [ ] 7. presentation/controllers/{nombre}.controller.ts
- [ ] 8. app.module.ts — controller + 2 providers (Repository + UseCase)
```

### Orden recomendado

1. **Domain primero** (entidad + contrato repositorio)
2. **Application** (caso de uso)
3. **Prisma** (modelo en schema)
4. **Infrastructure** (implementación Prisma)
5. **Presentation** (DTO + controller)
6. **app.module.ts** (wiring con `useFactory`)

## Registro en app.module.ts

Cada módulo necesita **3 piezas** en `app.module.ts`:

```typescript
// 1. Controller en controllers[]
TemplateController,

// 2. Repository con useFactory
{
  provide: TemplateRepository,
  useFactory: (prisma: PrismaService) => new PrismaTemplateRepository(prisma),
  inject: [PrismaService],
},

// 3. UseCase con useFactory
{
  provide: CreateTemplateUseCase,
  useFactory: (repo: TemplateRepository) => new CreateTemplateUseCase(repo),
  inject: [TemplateRepository],
},
```

`useFactory` es obligatorio porque `XxxRepository` es una **clase abstracta**. NestJS no puede instanciarla sin indicar la implementación concreta (`PrismaXxxRepository`).

`PrismaService` se registra **una sola vez** y lo comparten todos los repositorios.

## Convenciones de nombres

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Carpeta módulo | plural, kebab-case | `templates/` |
| Entidad | PascalCase | `Template` |
| Repositorio abstracto | `{Entity}Repository` | `TemplateRepository` |
| Repositorio Prisma | `Prisma{Entity}Repository` | `PrismaTemplateRepository` |
| Caso de uso | `{Action}{Entity}UseCase` | `CreateTemplateUseCase` |
| DTO | `{Action}{Entity}Dto` | `CreateTemplateDto` |
| Controller | `{Entity}Controller` | `TemplateController` |
| Ruta HTTP | plural kebab-case | `@Controller('templates')` |
| Modelo Prisma | PascalCase en schema | `model Template` |
| Acceso Prisma | camelCase minúscula | `prisma.template` |

## Plantillas mínimas

### Entidad (domain)

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

### Repositorio abstracto (domain)

```typescript
import { Product } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract create(product: Product): Promise<Product>;
}
```

### Caso de uso (application)

```typescript
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

### Repositorio Prisma (infrastructure)

```typescript
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

### Controller (presentation)

```typescript
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

## Comandos Prisma

Después de modificar `schema.prisma`:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Si el editor no reconoce modelos: reiniciar TS Server.

## Qué NO hacer

- Poner lógica de negocio en controllers o DTOs
- Importar Prisma en domain o application
- Crear archivos ORM por módulo (TypeORM legacy)
- Usar `prisma.Product` (PascalCase) — siempre minúscula
- Omitir registro en `app.module.ts`
- Mezclar validación HTTP y de negocio en un solo lugar

## Módulos de referencia

Consulta estos módulos existentes antes de inventar patrones nuevos:

| Módulo | Ubicación |
|--------|-----------|
| Users | `server/src/modules/users/` |
| Videos | `server/src/modules/videos/` |
| Templates | `server/src/modules/templates/` |

## Recursos adicionales

- Guía completa paso a paso: [references/module-guide.md](references/module-guide.md)
- Documento fuente del proyecto: `server/readmi.md`
