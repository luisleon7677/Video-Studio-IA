import {
  Body,
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UnprocessableEntityException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../../users/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../users/presentation/guards/jwt-auth.guard';
import type { AuthTokenPayload } from '../../../users/application/ports/token.service.port';
import { S3Service } from '../../../videos/infrastructure/storage/s3.service';
import { CreateTemplateUseCase } from '../../application/use-cases/create-template.use-case';
import { DeleteTemplateUseCase } from '../../application/use-cases/delete-template.use-case';
import { GetTemplateByIdUseCase } from '../../application/use-cases/get-template-by-id.use-case';
import { ListTemplatesUseCase } from '../../application/use-cases/list-templates.use-case';
import { UpdateTemplateUseCase } from '../../application/use-cases/update-template.use-case';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { ListTemplatesQueryDto } from '../dto/list-templates-query.dto';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import { toTemplateResponse } from '../mappers/template-response.mapper';

interface UploadedAudioFile {
  buffer: Buffer;
  originalname: string;
  mimetype?: string;
}

@Controller('sounds')
export class TemplateController {
  constructor(
    private readonly listTemplatesUseCase: ListTemplatesUseCase,
    private readonly getTemplateByIdUseCase: GetTemplateByIdUseCase,
    private readonly createTemplateUseCase: CreateTemplateUseCase,
    private readonly updateTemplateUseCase: UpdateTemplateUseCase,
    private readonly deleteTemplateUseCase: DeleteTemplateUseCase,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  async list(@Query() query: ListTemplatesQueryDto) {
    const templates = await this.listTemplatesUseCase.execute({
      search: query.search,
    });
    return {
      items: templates.map(toTemplateResponse),
      total: templates.length,
    };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const template = await this.getTemplateByIdUseCase.execute(id);
      return toTemplateResponse(template);
    } catch (error) {
      if (error instanceof Error && error.message === 'Audio no encontrado') {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() dto: CreateTemplateDto,
    @UploadedFile() file: UploadedAudioFile | undefined,
    @CurrentUser() user: AuthTokenPayload,
  ) {
    if (!file) {
      throw new BadRequestException('El archivo MP3 es obligatorio');
    }

    if (!this.isMp3File(file)) {
      throw new BadRequestException('El archivo debe ser un MP3');
    }

    const url = await this.s3Service.uploadSound({
      buffer: file.buffer,
      originalName: file.originalname,
      contentType: file.mimetype ?? 'audio/mpeg',
    });

    const template = await this.createTemplateUseCase.execute({
      name: dto.name,
      url,
      id_admin: user.userId,
    });
    return toTemplateResponse(template);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTemplateDto,
  ) {
    try {
      const template = await this.updateTemplateUseCase.execute({
        id,
        name: dto.name,
        url: dto.url,
      });
      return toTemplateResponse(template);
    } catch (error) {
      if (error instanceof Error && error.message === 'Audio no encontrado') {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.deleteTemplateUseCase.execute(id);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Audio no encontrado') {
          throw new NotFoundException(error.message);
        }
        if (error.message.includes('en uso')) {
          throw new UnprocessableEntityException(error.message);
        }
      }
      throw error;
    }
  }

  private isMp3File(file: UploadedAudioFile): boolean {
    const hasMp3Name = file.originalname.toLowerCase().endsWith('.mp3');
    const hasMp3Type = ['audio/mpeg', 'audio/mp3', 'audio/x-mpeg'].includes(
      file.mimetype ?? '',
    );

    return hasMp3Name || hasMp3Type;
  }
}
