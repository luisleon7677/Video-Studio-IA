import { Template } from '../../domain/entities/template.entity';
import { TemplateRepository } from '../../domain/repositories/template.repository';

export class GetTemplateByIdUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async execute(id: number): Promise<Template> {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }
    return template;
  }
}
