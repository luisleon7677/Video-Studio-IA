import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GetSellerByIdUseCase } from '../../application/use-cases/get-seller-by-id.use-case';
import { ListSellersUseCase } from '../../application/use-cases/list-sellers.use-case';
import { ListSellersQueryDto } from '../dto/list-sellers-query.dto';

@Controller('sellers')
export class SellerController {
  constructor(
    private readonly listSellersUseCase: ListSellersUseCase,
    private readonly getSellerByIdUseCase: GetSellerByIdUseCase,
  ) {}

  @Get()
  async list(@Query() query: ListSellersQueryDto) {
    const result = await this.listSellersUseCase.execute({
      page: query.page,
      limit: query.limit,
      search: query.search,
      company: query.company,
    });

    return {
      items: result.items.map((seller) => this.toResponse(seller)),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      summary: result.summary,
    };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const seller = await this.getSellerByIdUseCase.execute(id);
      return this.toResponse(seller);
    } catch (error) {
      if (error instanceof Error && error.message === 'Vendedor no encontrado') {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  private toResponse(seller: {
    id: number | null;
    name: string;
    company: string;
    code: string;
    idAdmin: number | null;
  }) {
    return {
      id: seller.id,
      name: seller.name,
      company: seller.company,
      code: seller.code,
      idAdmin: seller.idAdmin,
      videos: [],
    };
  }
}
