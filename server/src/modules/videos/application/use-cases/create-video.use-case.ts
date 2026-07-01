import { Video } from '../../domain/entities/video.entity';
import { VideoRepository } from '../../domain/repositories/video.repository';


export interface CreateVideoInput {
  name: string;
  url: string;
  idAdmin?: number | null;
  idSound?: number | null;
  type?: number | null;
  status?: number | null;
  idSeller?: number | null;
  config?: Record<string, unknown> | null;
}

export class CreateVideoUseCase {
  constructor(private readonly videoRepository: VideoRepository) {}

  async execute(input: CreateVideoInput): Promise<Video> {
    const idSeller = input.idSeller ?? null;
    const type = idSeller === null ? (input.type ?? null) : 2;

    const video = new Video(
      null,
      input.name,
      input.url,
      input.idAdmin ?? null,
      input.idSound ?? null,
      type,
      input.status ?? null,
      idSeller,
      input.config ?? null,
    );

    return this.videoRepository.create(video);
  }
}
