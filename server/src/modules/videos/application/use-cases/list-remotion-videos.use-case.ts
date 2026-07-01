import { Video } from '../../domain/entities/video.entity';
import { VideoRepository } from '../../domain/repositories/video.repository';

export class ListRemotionVideosUseCase {
  constructor(private readonly videoRepository: VideoRepository) {}

  async execute(): Promise<Video[]> {
    return this.videoRepository.findByType(1);
  }
}
