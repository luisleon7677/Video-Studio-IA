import { Prisma, PrismaClient } from '@prisma/client';
import { Video } from '../../domain/entities/video.entity';
import { VideoRepository } from '../../domain/repositories/video.repository';

export class PrismaVideoRepository implements VideoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(video: Video): Promise<Video> {
    const savedVideo = await this.prisma.video.create({
      data: {
        name: video.name,
        url: video.url,
        id_admin: video.idAdmin,
        id_sound: video.idSound,
        type: video.type,
        status: video.status,
        id_seller: video.idSeller,
        config: video.config ? (video.config as Prisma.InputJsonValue) : undefined,
      },
    });

    return Video.fromPersistence(savedVideo);
  }

  async findCapcutBySellerId(sellerId: number): Promise<Video[]> {
    const rows = await this.prisma.video.findMany({
      where: {
        id_seller: sellerId,
        type: 2,
      },
      orderBy: { id: 'desc' },
    });

    return rows.map((row) => Video.fromPersistence(row));
  }

  async findByType(type: number): Promise<Video[]> {
    const rows = await this.prisma.video.findMany({
      where: { type },
      orderBy: { id: 'desc' },
    });

    return rows.map((row) => Video.fromPersistence(row));
  }
}
