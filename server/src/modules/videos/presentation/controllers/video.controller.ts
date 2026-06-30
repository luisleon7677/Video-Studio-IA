import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateCapcutVideoDto,
  CreateVideoDto,
  RenderAnimationVideoDto,
  UploadAnimationVideoDto,
  UploadCapcutVideoDto,
} from '../dto/create-video.dto';
import { CreateVideoUseCase } from '../../application/use-cases/create-video.use-case';
import { S3Service } from '../../infrastructure/storage/s3.service';
import { Video } from '../../domain/entities/video.entity';
import { RemotionService } from '../../infrastructure/remotion/service.remotion';

interface UploadedVideoFile {
  buffer: Buffer;
  originalname: string;
  mimetype?: string;
}

@Controller('videos')
export class VideoController {
  constructor(
    private readonly createVideoUseCase: CreateVideoUseCase,
    private readonly s3Service: S3Service,
    private readonly remotionService: RemotionService,
  ) {}

  @Post()
  async create(@Body() dto: CreateVideoDto) {
    const video = await this.createVideoUseCase.execute({
      name: dto.name,
      url: dto.url,
      idAdmin: dto.idAdmin,
      idTemplate: dto.idTemplate,
      type: dto.type,
      status: dto.status,
      idSeller: dto.idSeller,
    });

    return this.toResponse(video);
  }

  @Post('capcut')
  async createCapcut(@Body() dto: CreateCapcutVideoDto) {
    const video = await this.createVideoUseCase.execute({
      name: dto.name,
      url: dto.url,
      idAdmin: dto.idAdmin,
      status: dto.status,
      idSeller: dto.idSeller,
      type: 2,
    });

    return this.toResponse(video);
  }

  @Post('capcut/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCapcut(
    @UploadedFile() file: UploadedVideoFile | undefined,
    @Body() dto: UploadCapcutVideoDto,
  ) {
    if (!file) {
      throw new BadRequestException('El archivo de video es obligatorio');
    }

    if (!file.mimetype?.startsWith('video/')) {
      throw new BadRequestException('El archivo debe ser un video');
    }

    const url = await this.s3Service.uploadCapcutVideo({
      buffer: file.buffer,
      originalName: file.originalname,
      contentType: file.mimetype,
      sellerId: dto.idSeller,
    });

    const video = await this.createVideoUseCase.execute({
      name: dto.name ?? file.originalname.replace(/\.[^.]+$/, ''),
      url,
      idAdmin: dto.idAdmin,
      status: dto.status,
      idSeller: dto.idSeller,
      type: 2,
    });

    return this.toResponse(video);
  }

  @Post('animations/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAnimation(
    @UploadedFile() file: UploadedVideoFile | undefined,
    @Body() dto: UploadAnimationVideoDto,
  ) {
    if (!file) {
      throw new BadRequestException('El archivo de video es obligatorio');
    }

    if (!file.mimetype?.startsWith('video/')) {
      throw new BadRequestException('El archivo debe ser un video');
    }

    const url = await this.s3Service.uploadAnimationVideo({
      buffer: file.buffer,
      originalName: file.originalname,
      contentType: file.mimetype,
      templateId: dto.templateId,
    });

    return {
      name: dto.name ?? file.originalname.replace(/\.[^.]+$/, ''),
      url,
      templateId: dto.templateId,
    };
  }

  @Post('animations/render')
  async renderAnimation(@Body() dto: RenderAnimationVideoDto) {
    return this.remotionService.requestRender({
      compositionId: dto.compositionId,
      templateId: dto.templateId,
      inputProps: dto.inputProps,
    });
  }

  private toResponse(video: Video) {
    return {
      id: video.id,
      name: video.name,
      url: video.url,
      idAdmin: video.idAdmin,
      idTemplate: video.idTemplate,
      type: video.type,
      status: video.status,
      idSeller: video.idSeller,
    };
  }
}
