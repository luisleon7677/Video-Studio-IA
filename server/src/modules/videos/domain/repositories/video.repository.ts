import { Video } from '../entities/video.entity';

export abstract class VideoRepository {
  abstract create(video: Video): Promise<Video>;
  abstract findCapcutBySellerId(sellerId: number): Promise<Video[]>;
  abstract findByType(type: number): Promise<Video[]>;
}
