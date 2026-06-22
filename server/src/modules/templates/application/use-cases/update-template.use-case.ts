import { Template } from '../../domain/entities/template.entity';
import { TemplateRepository } from '../../domain/repositories/template.repository';

export interface UpdateTemplateInput {
  id: number;
  name: string;
  content: string;
}

export class UpdateTemplateUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async execute(input: UpdateTemplateInput): Promise<Template> {
    const existing = await this.templateRepository.findById(input.id);
    if (!existing) {
      throw new Error('Plantilla no encontrada');
    }

    const template = new Template(
      input.id,
      input.name,
      input.content,
      existing.id_admin,
      existing.createdAt,
      existing.updatedAt,
    );

    return this.templateRepository.update(template);
  }
}
