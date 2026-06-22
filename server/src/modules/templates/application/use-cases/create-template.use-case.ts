import { Template } from '../../domain/entities/template.entity';
import { TemplateRepository } from '../../domain/repositories/template.repository';

export interface CreateTemplateInput {
  name: string;
  content: string;
  id_admin: number;
}

export class CreateTemplateUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async execute(input: CreateTemplateInput): Promise<Template> {
    const template = new Template(
      null,
      input.name,
      input.content,
      input.id_admin,
    );
    return this.templateRepository.create(template);
  }
}
