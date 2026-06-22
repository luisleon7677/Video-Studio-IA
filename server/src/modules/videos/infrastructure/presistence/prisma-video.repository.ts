import { PrismaClient } from '@prisma/client';
import { Video } from '../../domain/entities/video.entity';
import { VideoRepository } from '../../domain/repositories/video.repository';

export class PrismaVideoRepository implements VideoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(video: Video): Promise<Video> {
    const savedVideo = await this.prisma.video.create({
      data: {
        name: video.name,
        url: video.url,
      },
    });

    return new Video(savedVideo.id, savedVideo.name, savedVideo.url);
  }
}
