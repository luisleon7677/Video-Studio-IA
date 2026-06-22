import { Body, Controller, Post } from '@nestjs/common';
import { CreateVideoDto } from '../dto/create-video.dto';
import { CreateVideoUseCase } from '../../application/use-cases/create-video.use-case';

@Controller('videos')
export class VideoController {
    constructor(
        private readonly createVideoUseCase: CreateVideoUseCase,
    ) {}
    @Post()
    async create(@Body() dto: CreateVideoDto) {
        const video = await this.createVideoUseCase.execute({ name: dto.name, url: dto.url });
        return {
            id: video.id,
            name: video.name,
            url: video.url,
        };
    }
}
