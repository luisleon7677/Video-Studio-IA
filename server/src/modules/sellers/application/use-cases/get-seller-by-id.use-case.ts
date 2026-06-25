import { Seller } from '../../domain/entities/seller.entity';
import { SellerRepository } from '../../domain/repositories/seller.repository';

export class GetSellerByIdUseCase {
  constructor(private readonly sellerRepository: SellerRepository) {}

  async execute(id: number): Promise<Seller> {
    const seller = await this.sellerRepository.findById(id);

    if (!seller) {
      throw new Error('Vendedor no encontrado');
    }

    return seller;
  }
}
