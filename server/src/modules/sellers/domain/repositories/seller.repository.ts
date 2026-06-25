import { Seller } from '../entities/seller.entity';

export interface ListSellersParams {
  page: number;
  limit: number;
  search?: string;
  company?: string;
}

export interface PaginatedSellers {
  items: Seller[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SellersSummary {
  total: number;
  byCompany: Record<string, number>;
  companies: string[];
}

export abstract class SellerRepository {
  abstract findPaginated(params: ListSellersParams): Promise<PaginatedSellers>;
  abstract findById(id: number): Promise<Seller | null>;
  abstract getSummary(): Promise<SellersSummary>;
}
