import { Prisma, PrismaClient } from '@prisma/client';
import { Seller } from '../../domain/entities/seller.entity';
import {
  ListSellersParams,
  PaginatedSellers,
  SellerRepository,
  SellersSummary,
} from '../../domain/repositories/seller.repository';

export class PrismaSellerRepository implements SellerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPaginated(params: ListSellersParams): Promise<PaginatedSellers> {
    const { page, limit, search, company } = params;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(search, company);

    const [rows, total] = await Promise.all([
      this.prisma.sellers.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ company: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.sellers.count({ where }),
    ]);

    return {
      items: rows.map((row) => Seller.fromPersistence(row)),
      total,
      page,
      limit,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Seller | null> {
    const row = await this.prisma.sellers.findUnique({ where: { id } });
    return row ? Seller.fromPersistence(row) : null;
  }

  async getSummary(): Promise<SellersSummary> {
    const [total, grouped] = await Promise.all([
      this.prisma.sellers.count(),
      this.prisma.sellers.groupBy({
        by: ['company'],
        _count: { company: true },
        where: { company: { not: null } },
      }),
    ]);

    const byCompany: Record<string, number> = {};
    const companies: string[] = [];

    for (const row of grouped) {
      const company = row.company?.trim();
      if (!company) continue;
      byCompany[company] = row._count.company;
      companies.push(company);
    }

    companies.sort((a, b) => a.localeCompare(b, 'es'));

    return { total, byCompany, companies };
  }

  private buildWhere(search?: string, company?: string): Prisma.sellersWhereInput {
    const where: Prisma.sellersWhereInput = {};

    if (company && company !== 'all') {
      where.company = company.trim();
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
      ];
    }

    return where;
  }
}
