import { Video } from '../../domain/entities/video.entity';
import { VideoRepository } from '../../domain/repositories/video.repository';

export class ListCapcutVideosBySellerUseCase {
  constructor(private readonly videoRepository: VideoRepository) {}

  async execute(sellerId: number): Promise<Video[]> {
    return this.videoRepository.findCapcutBySellerId(sellerId);
  }
}
