import { Prisma, PrismaClient } from '@prisma/client';
import { Template } from '../../domain/entities/template.entity';
import {
  ListTemplatesParams,
  TemplateRepository,
} from '../../domain/repositories/template.repository';

export class PrismaTemplateRepository implements TemplateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(params?: ListTemplatesParams): Promise<Template[]> {
    const where = this.buildWhere(params?.search);
    const rows = await this.prisma.templates.findMany({
      where,
      orderBy: { update_at: 'desc' },
    });
    return rows.map((row) => Template.fromPersistence(row));
  }

  async findById(id: number): Promise<Template | null> {
    const row = await this.prisma.templates.findUnique({ where: { id } });
    return row ? Template.fromPersistence(row) : null;
  }

  async create(template: Template): Promise<Template> {
    const saved = await this.prisma.templates.create({
      data: {
        name: template.name,
        content: template.content,
        id_admin: template.id_admin,
      },
    });
    return Template.fromPersistence(saved);
  }

  async update(template: Template): Promise<Template> {
    const saved = await this.prisma.templates.update({
      where: { id: template.id! },
      data: {
        name: template.name,
        content: template.content,
        update_at: new Date(),
      },
    });
    return Template.fromPersistence(saved);
  }

  async countVideosByTemplateId(id: number): Promise<number> {
    return this.prisma.video.count({ where: { id_template: id } });
  }

  async deleteById(id: number): Promise<boolean> {
    const existing = await this.prisma.templates.findUnique({ where: { id } });
    if (!existing) return false;
    await this.prisma.templates.delete({ where: { id } });
    return true;
  }

  private buildWhere(search?: string): Prisma.templatesWhereInput {
    if (!search) return {};

    return {
      OR: [
        { name: { contains: search } },
        { content: { contains: search } },
      ],
    };
  }
}
