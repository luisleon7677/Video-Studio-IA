import { Template } from '../../domain/entities/template.entity';

export function toTemplateResponse(template: Template) {
  return {
    id: template.id,
    name: template.name,
    url: template.url,
    idAdmin: template.id_admin,
    createdAt: template.createdAt?.toISOString() ?? null,
    updatedAt: template.updatedAt?.toISOString() ?? null,
  };
}
