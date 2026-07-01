import { TemplateRepository } from '../../domain/repositories/template.repository';

export class DeleteTemplateUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.templateRepository.findById(id);
    if (!existing) {
      throw new Error('Audio no encontrado');
    }

    const videosCount = await this.templateRepository.countVideosBySoundId(id);
    if (videosCount > 0) {
      throw new Error('No se puede eliminar: el audio esta en uso por videos');
    }

    const deleted = await this.templateRepository.deleteById(id);
    if (!deleted) {
      throw new Error('Audio no encontrado');
    }
  }
}
