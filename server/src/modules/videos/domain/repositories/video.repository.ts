import { Video } from '../entities/video.entity';

export abstract class VideoRepository {
    // Contrato para guardar videos
    abstract create(video: Video): Promise<Video>;
}