import { Template } from '../entities/template.entity';

export interface ListTemplatesParams {
  search?: string;
}

export abstract class TemplateRepository {
  abstract findAll(params?: ListTemplatesParams): Promise<Template[]>;
  abstract findById(id: number): Promise<Template | null>;
  abstract create(template: Template): Promise<Template>;
  abstract update(template: Template): Promise<Template>;
  abstract countVideosByTemplateId(id: number): Promise<number>;
  abstract deleteById(id: number): Promise<boolean>;
}
