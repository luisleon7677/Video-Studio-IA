import { SaleRepository } from '../../domain/repositories/sale.repository';

export class DeleteSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.saleRepository.deleteById(id);

    if (!deleted) {
      throw new Error('Venta no encontrada');
    }
  }
}
