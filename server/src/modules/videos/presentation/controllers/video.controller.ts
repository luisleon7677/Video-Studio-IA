import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { promises as fs } from 'fs';
import {
  CreateCapcutVideoDto,
  CreateVideoDto,
  RenderAnimationVideoDto,
  UploadAnimationVideoDto,
  UploadCapcutVideoDto,
} from '../dto/create-video.dto';
import { CreateVideoUseCase } from '../../application/use-cases/create-video.use-case';
import { ListRemotionVideosUseCase } from '../../application/use-cases/list-remotion-videos.use-case';
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
    private readonly listRemotionVideosUseCase: ListRemotionVideosUseCase,
    private readonly s3Service: S3Service,
    private readonly remotionService: RemotionService,
  ) {}

  @Post()
  async create(@Body() dto: CreateVideoDto) {
    const video = await this.createVideoUseCase.execute({
      name: dto.name,
      url: dto.url,
      idAdmin: dto.idAdmin,
      idSound: dto.idSound,
      type: dto.type,
      status: dto.status,
      idSeller: dto.idSeller,
      config: dto.config,
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
    });

    return {
      name: dto.name ?? file.originalname.replace(/\.[^.]+$/, ''),
      url,
      templateId: dto.templateId,
    };
  }

  @Post('animations/render')
  async renderAnimation(@Body() dto: RenderAnimationVideoDto) {
    let renderFilePath: string | null = null;

    try {
      const render = await this.remotionService.requestRender({
        compositionId: dto.compositionId,
        templateId: dto.templateId,
        inputProps: dto.inputProps,
      });
      renderFilePath = render.filePath;

      const outputName = this.ensureMp4Extension(dto.outputName);
      const buffer = await fs.readFile(render.filePath);
      const url = await this.s3Service.uploadAnimationVideo({
        buffer,
        originalName: outputName,
        contentType: 'video/mp4',
      });

      const video = await this.createVideoUseCase.execute({
        name: outputName.replace(/\.[^.]+$/, ''),
        url,
        idAdmin: dto.idAdmin,
        idSound: dto.idSound,
        status: dto.status ?? 1,
        type: 1,
        config: dto.audioConfig ?? null,
      });

      return {
        ...this.toResponse(video),
        jobId: render.jobId,
        compositionId: render.compositionId,
        templateId: render.templateId,
        inputProps: render.inputProps,
        fileName: outputName,
        downloadUrl: url,
        message: 'Video renderizado y subido a S3. Ya esta disponible en el historial.',
      };
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'No se pudo renderizar el video';

      throw new InternalServerErrorException(message);
    } finally {
      if (renderFilePath) {
        await this.remotionService.cleanupRenderFile(renderFilePath);
      }
    }
  }

  @Get('animations/history')
  async listAnimationHistory() {
    const videos = await this.listRemotionVideosUseCase.execute();
    return {
      items: videos.map((video) => this.toResponse(video)),
    };
  }

  private toResponse(video: Video) {
    return {
      id: video.id,
      name: video.name,
      url: video.url,
      idAdmin: video.idAdmin,
      idSound: video.idSound,
      type: video.type,
      status: video.status,
      idSeller: video.idSeller,
      config: video.config,
    };
  }

  private ensureMp4Extension(fileName: string): string {
    const trimmed = fileName.trim();
    if (!trimmed) {
      throw new BadRequestException('El nombre del video es obligatorio');
    }

    return trimmed.toLowerCase().endsWith('.mp4') ? trimmed : `${trimmed}.mp4`;
  }
}
