import { Prisma, PrismaClient } from '@prisma/client';
import { Sale } from '../../domain/entities/sale.entity';
import {
  ListSalesParams,
  PaginatedSales,
  SaleRepository,
  SalesSummary,
  SalesTrend,
  SalesTrendPoint,
} from '../../domain/repositories/sale.repository';

export class PrismaSaleRepository implements SaleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findPaginated(params: ListSalesParams): Promise<PaginatedSales> {
    const { page, limit, search, channel } = params;
    const skip = (page - 1) * limit;
    const where = this.buildWhere(search, channel);

    const [rows, total] = await Promise.all([
      this.prisma.sales.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date_seller: 'desc' },
      }),
      this.prisma.sales.count({ where }),
    ]);

    return {
      items: rows.map((row) => this.toDomain(row)),
      total,
      page,
      limit,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    };
  }

  async getSummary(): Promise<SalesSummary> {
    const [total, grouped] = await Promise.all([
      this.prisma.sales.count(),
      this.prisma.sales.groupBy({
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

  async getTrend(): Promise<SalesTrend> {
    const rows = await this.prisma.sales.findMany({
      where: {
        company: { not: null },
        date_seller: { not: null },
      },
      select: { company: true, date_seller: true },
      orderBy: { date_seller: 'asc' },
    });

    const companiesSet = new Set<string>();
    const byDate = new Map<string, Record<string, number>>();

    for (const row of rows) {
      const company = row.company?.trim();
      if (!company || !row.date_seller) continue;

      companiesSet.add(company);
      const date = this.toDateKey(row.date_seller);
      const counts = byDate.get(date) ?? {};
      counts[company] = (counts[company] ?? 0) + 1;
      byDate.set(date, counts);
    }

    const companies = [...companiesSet].sort((a, b) => a.localeCompare(b, 'es'));
    if (companies.length === 0 || byDate.size === 0) {
      return { companies: [], points: [] };
    }

    const sortedDates = [...byDate.keys()].sort();
    const start = this.parseDateKey(sortedDates[0]);
    const end = this.parseDateKey(sortedDates[sortedDates.length - 1]);
    const points: SalesTrendPoint[] = [];

    for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      const date = this.toDateKey(cursor);
      const existing = byDate.get(date) ?? {};
      const counts: Record<string, number> = {};

      for (const company of companies) {
        counts[company] = existing[company] ?? 0;
      }

      points.push({ date, counts });
    }

    return { companies, points };
  }

  async deleteById(id: number): Promise<boolean> {
    const existing = await this.prisma.sales.findUnique({ where: { id } });
    if (!existing) return false;

    await this.prisma.sales.delete({ where: { id } });
    return true;
  }

  private buildWhere(search?: string, channel?: string): Prisma.salesWhereInput {
    const where: Prisma.salesWhereInput = {};

    if (channel && channel !== 'all') {
      where.company = channel.trim();
    }

    if (search) {
      const code = Number.parseInt(search, 10);
      const orFilters: Prisma.salesWhereInput[] = [
        { seller: { contains: search } },
      ];

      if (!Number.isNaN(code)) {
        orFilters.push({ code_seller: code });
      }

      where.OR = orFilters;
    }

    return where;
  }

  private toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private parseDateKey(dateKey: string): Date {
    return new Date(`${dateKey}T00:00:00.000Z`);
  }

  private toDomain(row: {
    id: number;
    seller: string | null;
    code_seller: number | null;
    date_seller: Date | null;
    company: string | null;
  }): Sale {
    return Sale.fromPersistence(row);
  }
}
