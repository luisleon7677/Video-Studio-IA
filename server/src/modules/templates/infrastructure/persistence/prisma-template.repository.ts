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
    const rows = await this.prisma.sounds.findMany({
      where,
      orderBy: { update_at: 'desc' },
    });
    return rows.map((row) => Template.fromPersistence(row));
  }

  async findById(id: number): Promise<Template | null> {
    const row = await this.prisma.sounds.findUnique({ where: { id } });
    return row ? Template.fromPersistence(row) : null;
  }

  async create(template: Template): Promise<Template> {
    const saved = await this.prisma.sounds.create({
      data: {
        name: template.name,
        url: template.url,
        id_admin: template.id_admin,
      },
    });
    return Template.fromPersistence(saved);
  }

  async update(template: Template): Promise<Template> {
    const saved = await this.prisma.sounds.update({
      where: { id: template.id! },
      data: {
        name: template.name,
        url: template.url,
        update_at: new Date(),
      },
    });
    return Template.fromPersistence(saved);
  }

  async countVideosBySoundId(id: number): Promise<number> {
    return this.prisma.video.count({ where: { id_sound: id } });
  }

  async deleteById(id: number): Promise<boolean> {
    const existing = await this.prisma.sounds.findUnique({ where: { id } });
    if (!existing) return false;
    await this.prisma.sounds.delete({ where: { id } });
    return true;
  }

  private buildWhere(search?: string): Prisma.soundsWhereInput {
    if (!search) return {};

    return {
      OR: [
        { name: { contains: search } },
        { url: { contains: search } },
      ],
    };
  }
}
