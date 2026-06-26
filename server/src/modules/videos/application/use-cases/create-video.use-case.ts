import { Video } from '../../domain/entities/video.entity';
import { VideoRepository } from '../../domain/repositories/video.repository';


export interface CreateVideoInput {
  name: string;
  url: string;
  idAdmin?: number | null;
  idTemplate?: number | null;
  type?: number | null;
  status?: number | null;
  idSeller?: number | null;
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
      input.idTemplate ?? null,
      type,
      input.status ?? null,
      idSeller,
    );

    return this.videoRepository.create(video);
  }
}
