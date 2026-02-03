import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { InventarioDto } from './domain/dtos/invetario.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiStandardResponses } from 'src/_shared/decorators/api-response.decorator';
import { AuthGuard } from 'src/_shared/guard/auth.guard';

@Controller('estoque')
@ApiTags('estoque')
@UseGuards(AuthGuard)
@ApiStandardResponses()
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @ApiOperation({
    summary: 'Buscar inventário por centro e data',
    operationId: 'getInventariosByCenterAndData',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventário encontrado com sucesso',
    type: [InventarioDto],
  })
  @Get('get-inventarios-by-center-and-data/:centerId/:data')
  async getInventariosByCenterAndData(
    @Param('centerId') centerId: string,
    @Param('data') data: string,
  ): Promise<InventarioDto[]> {
    return this.estoqueService.getInventariosByCenterAndData(centerId, data);
  }

  @Post('create-inventario/:centerId')
  @ApiOperation({
    summary: 'Criar inventário',
    operationId: 'createInventario',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventário criado com sucesso',
    type: String,
  })
  async createInventario(
    @Param('centerId') centerId: string,
    @Body() inventarioDto: InventarioDto,
  ): Promise<string> {
    return this.estoqueService.createInventario(centerId, inventarioDto);
  }

  @Put('update/:id')
  @ApiOperation({
    summary: 'Atualizar inventário',
    operationId: 'updateInventario',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventário atualizado com sucesso',
    type: String,
  })
  async editarInventario(
    @Param('id') id: string,
    @Body() inventarioDto: InventarioDto,
  ): Promise<string> {
    return this.estoqueService.editarInventario(id, inventarioDto);
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Deletar inventário',
    operationId: 'deleteInventario',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventário deletado com sucesso',
    type: Boolean,
  })
  async deletarInventario(@Param('id') id: string): Promise<void> {
    return this.estoqueService.deletarInventario(id);
  }

  @Get('get-inventario-by-id/:id')
  @ApiOperation({
    summary: 'Buscar inventário por ID',
    operationId: 'getInventarioById',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventário encontrado com sucesso',
    type: InventarioDto,
  })
  async getInventarioById(@Param('id') id: string): Promise<InventarioDto> {
    return this.estoqueService.getInventarioById(id);
  }
}
