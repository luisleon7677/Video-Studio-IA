import { Sale } from '../entities/sale.entity';

export interface ListSalesParams {
  page: number;
  limit: number;
  search?: string;
  channel?: string;
}

export interface PaginatedSales {
  items: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SalesSummary {
  total: number;
  byCompany: Record<string, number>;
  companies: string[];
}

export interface SalesTrendPoint {
  date: string;
  counts: Record<string, number>;
}

export interface SalesTrend {
  companies: string[];
  points: SalesTrendPoint[];
}

export abstract class SaleRepository {
  abstract findPaginated(params: ListSalesParams): Promise<PaginatedSales>;
  abstract getSummary(): Promise<SalesSummary>;
  abstract getTrend(): Promise<SalesTrend>;
  abstract deleteById(id: number): Promise<boolean>;
}
