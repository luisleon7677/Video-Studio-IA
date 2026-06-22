import { SaleRepository, SalesTrend } from '../../domain/repositories/sale.repository';

export class GetSalesTrendUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  execute(): Promise<SalesTrend> {
    return this.saleRepository.getTrend();
  }
}
