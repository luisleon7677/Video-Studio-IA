import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';

import { VideoController } from './modules/videos/presentation/controllers/video.controller';
import { CreateVideoUseCase } from './modules/videos/application/use-cases/create-video.use-case';
import { ListCapcutVideosBySellerUseCase } from './modules/videos/application/use-cases/list-capcut-videos-by-seller.use-case';
import { ListRemotionVideosUseCase } from './modules/videos/application/use-cases/list-remotion-videos.use-case';
import { VideoRepository } from './modules/videos/domain/repositories/video.repository';
import { PrismaVideoRepository } from './modules/videos/infrastructure/presistence/prisma-video.repository';
import { S3Service } from './modules/videos/infrastructure/storage/s3.service';
import { TemplateRepository } from './modules/templates/domain/repositories/template.repository';
import { PrismaTemplateRepository } from './modules/templates/infrastructure/persistence/prisma-template.repository';
import { TemplateController } from './modules/templates/presentation/controllers/template.controller';
import { CreateTemplateUseCase } from './modules/templates/application/use-cases/create-template.use-case';
import { ListTemplatesUseCase } from './modules/templates/application/use-cases/list-templates.use-case';
import { GetTemplateByIdUseCase } from './modules/templates/application/use-cases/get-template-by-id.use-case';
import { UpdateTemplateUseCase } from './modules/templates/application/use-cases/update-template.use-case';
import { DeleteTemplateUseCase } from './modules/templates/application/use-cases/delete-template.use-case';
import { SaleController } from './modules/sales/presentation/controllers/sale.controller';
import { ListSalesUseCase } from './modules/sales/application/use-cases/list-sales.use-case';
import { DeleteSaleUseCase } from './modules/sales/application/use-cases/delete-sale.use-case';
import { GetSalesTrendUseCase } from './modules/sales/application/use-cases/get-sales-trend.use-case';
import { SaleRepository } from './modules/sales/domain/repositories/sale.repository';
import { PrismaSaleRepository } from './modules/sales/infrastructure/persistence/prisma-sale.repository';
import { AuthController } from './modules/users/presentation/controllers/auth.controller';
import { UserRepository } from './modules/users/domain/repositories/user.repository';
import { PrismaUserRepository } from './modules/users/infrastructure/persistence/prisma-user.repository';
import { PasswordHasher } from './modules/users/application/ports/password-hasher.port';
import { BcryptPasswordHasher } from './modules/users/infrastructure/security/bcrypt-password.hasher';
import { TokenService } from './modules/users/application/ports/token.service.port';
import { JwtTokenService } from './modules/users/infrastructure/security/jwt-token.service';
import { RegisterAdminUseCase } from './modules/users/application/use-cases/register-admin.use-case';
import { LoginUseCase } from './modules/users/application/use-cases/login.use-case';
import { JwtAuthGuard } from './modules/users/presentation/guards/jwt-auth.guard';
import { SellerController } from './modules/sellers/presentation/controllers/seller.controller';
import { SellerRepository } from './modules/sellers/domain/repositories/seller.repository';
import { PrismaSellerRepository } from './modules/sellers/infrastructure/persistence/prisma-seller.repository';
import { ListSellersUseCase } from './modules/sellers/application/use-cases/list-sellers.use-case';
import { GetSellerByIdUseCase } from './modules/sellers/application/use-cases/get-seller-by-id.use-case';
import { RemotionService } from './modules/videos/infrastructure/remotion/service.remotion';



@Module({
  imports: [ ],
  controllers: [AppController, VideoController, TemplateController, SaleController, SellerController, AuthController],
  providers: [
    AppService,
    PrismaService,
    S3Service,
    RemotionService,
    {
      provide: TemplateRepository,
      useFactory: (prisma: PrismaService) => new PrismaTemplateRepository(prisma),
      inject: [PrismaService],
    },
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
    {
      provide: ListCapcutVideosBySellerUseCase,
      useFactory: (videoRepository: VideoRepository) =>
        new ListCapcutVideosBySellerUseCase(videoRepository),
      inject: [VideoRepository],
    },
    {
      provide: ListRemotionVideosUseCase,
      useFactory: (videoRepository: VideoRepository) =>
        new ListRemotionVideosUseCase(videoRepository),
      inject: [VideoRepository],
    },
    {
      provide: CreateTemplateUseCase,
      useFactory: (templateRepository: TemplateRepository) =>
        new CreateTemplateUseCase(templateRepository),
      inject: [TemplateRepository],
    },
    {
      provide: ListTemplatesUseCase,
      useFactory: (templateRepository: TemplateRepository) =>
        new ListTemplatesUseCase(templateRepository),
      inject: [TemplateRepository],
    },
    {
      provide: GetTemplateByIdUseCase,
      useFactory: (templateRepository: TemplateRepository) =>
        new GetTemplateByIdUseCase(templateRepository),
      inject: [TemplateRepository],
    },
    {
      provide: UpdateTemplateUseCase,
      useFactory: (templateRepository: TemplateRepository) =>
        new UpdateTemplateUseCase(templateRepository),
      inject: [TemplateRepository],
    },
    {
      provide: DeleteTemplateUseCase,
      useFactory: (templateRepository: TemplateRepository) =>
        new DeleteTemplateUseCase(templateRepository),
      inject: [TemplateRepository],
    },
    {
      provide: SaleRepository,
      useFactory: (prisma: PrismaService) => new PrismaSaleRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: ListSalesUseCase,
      useFactory: (saleRepository: SaleRepository) =>
        new ListSalesUseCase(saleRepository),
      inject: [SaleRepository],
    },
    {
      provide: GetSalesTrendUseCase,
      useFactory: (saleRepository: SaleRepository) =>
        new GetSalesTrendUseCase(saleRepository),
      inject: [SaleRepository],
    },
    {
      provide: DeleteSaleUseCase,
      useFactory: (saleRepository: SaleRepository) =>
        new DeleteSaleUseCase(saleRepository),
      inject: [SaleRepository],
    },
    {
      provide: SellerRepository,
      useFactory: (prisma: PrismaService) => new PrismaSellerRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: ListSellersUseCase,
      useFactory: (sellerRepository: SellerRepository) =>
        new ListSellersUseCase(sellerRepository),
      inject: [SellerRepository],
    },
    {
      provide: GetSellerByIdUseCase,
      useFactory: (sellerRepository: SellerRepository) =>
        new GetSellerByIdUseCase(sellerRepository),
      inject: [SellerRepository],
    },
    {
      provide: UserRepository,
      useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TokenService,
      useFactory: () =>
        new JwtTokenService(process.env.JWT_SECRET ?? 'dev-secret-change-me'),
    },
    {
      provide: RegisterAdminUseCase,
      useFactory: (userRepository: UserRepository, passwordHasher: PasswordHasher) =>
        new RegisterAdminUseCase(userRepository, passwordHasher),
      inject: [UserRepository, PasswordHasher],
    },
    {
      provide: LoginUseCase,
      useFactory: (userRepository: UserRepository, passwordHasher: PasswordHasher) =>
        new LoginUseCase(userRepository, passwordHasher),
      inject: [UserRepository, PasswordHasher],
    },
    JwtAuthGuard,
  ],
})
export class AppModule {}
