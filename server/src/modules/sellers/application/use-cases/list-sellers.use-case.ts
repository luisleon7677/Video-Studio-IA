import {
  ListSellersParams,
  PaginatedSellers,
  SellerRepository,
  SellersSummary,
} from '../../domain/repositories/seller.repository';

export interface ListSellersInput {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
}

export interface ListSellersResult extends PaginatedSellers {
  summary: SellersSummary;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 8;

export class ListSellersUseCase {
  constructor(private readonly sellerRepository: SellerRepository) {}

  async execute(input: ListSellersInput = {}): Promise<ListSellersResult> {
    const params: ListSellersParams = {
      page: input.page ?? DEFAULT_PAGE,
      limit: input.limit ?? DEFAULT_LIMIT,
      search: input.search?.trim() || undefined,
      company: input.company,
    };

    const [paginated, summary] = await Promise.all([
      this.sellerRepository.findPaginated(params),
      this.sellerRepository.getSummary(),
    ]);

    return { ...paginated, summary };
  }
}
