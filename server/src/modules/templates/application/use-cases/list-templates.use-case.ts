import {
  ListTemplatesParams,
  TemplateRepository,
} from '../../domain/repositories/template.repository';
import { Template } from '../../domain/entities/template.entity';

export interface ListTemplatesInput {
  search?: string;
}

export class ListTemplatesUseCase {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async execute(input: ListTemplatesInput = {}): Promise<Template[]> {
    const params: ListTemplatesParams = {
      search: input.search?.trim() || undefined,
    };
    return this.templateRepository.findAll(params);
  }
}
