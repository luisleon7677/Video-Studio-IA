import {
  ListSalesParams,
  PaginatedSales,
  SaleRepository,
  SalesSummary,
} from '../../domain/repositories/sale.repository';

export interface ListSalesInput {
  page?: number;
  limit?: number;
  search?: string;
  channel?: string;
}

export interface ListSalesResult extends PaginatedSales {
  summary: SalesSummary;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

export class ListSalesUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(input: ListSalesInput = {}): Promise<ListSalesResult> {
    const params: ListSalesParams = {
      page: input.page ?? DEFAULT_PAGE,
      limit: input.limit ?? DEFAULT_LIMIT,
      search: input.search?.trim() || undefined,
      channel: input.channel,
    };

    const [paginated, summary] = await Promise.all([
      this.saleRepository.findPaginated(params),
      this.saleRepository.getSummary(),
    ]);

    return { ...paginated, summary };
  }
}
