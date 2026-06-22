import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DeleteSaleUseCase } from '../../application/use-cases/delete-sale.use-case';
import { GetSalesTrendUseCase } from '../../application/use-cases/get-sales-trend.use-case';
import { ListSalesUseCase } from '../../application/use-cases/list-sales.use-case';
import { ListSalesQueryDto } from '../dto/list-sales-query.dto';

@Controller('sales')
export class SaleController {
  constructor(
    private readonly listSalesUseCase: ListSalesUseCase,
    private readonly getSalesTrendUseCase: GetSalesTrendUseCase,
    private readonly deleteSaleUseCase: DeleteSaleUseCase,
  ) {}

  @Get('trend')
  async trend() {
    return this.getSalesTrendUseCase.execute();
  }

  @Get()
  async list(@Query() query: ListSalesQueryDto) {
    const result = await this.listSalesUseCase.execute({
      page: query.page,
      limit: query.limit,
      search: query.search,
      channel: query.channel,
    });

    return {
      items: result.items.map((sale) => ({
        id: sale.id,
        sellerName: sale.seller,
        sellerCode: String(sale.codeSeller).padStart(4, '0'),
        soldAt: sale.dateSeller.toISOString(),
        channel: sale.channel,
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
      summary: result.summary,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.deleteSaleUseCase.execute(id);
      return { success: true };
    } catch (error) {
      if (error instanceof Error && error.message === 'Venta no encontrada') {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
