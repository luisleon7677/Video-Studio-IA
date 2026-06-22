import { Video } from '../../domain/entities/video.entity';
import { VideoRepository } from '../../domain/repositories/video.repository';


export interface CreateVideoInput {
    name: string;
    url: string;
}

export class CreateVideoUseCase {
    constructor(
        private readonly videoRepository: VideoRepository,
    ) {}
    async execute(input: CreateVideoInput): Promise<Video> {
        const video = new Video(null, input.name, input.url);
        return this.videoRepository.create(video);
    }
}