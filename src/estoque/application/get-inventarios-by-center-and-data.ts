import { Inject } from '@nestjs/common';
import { type IEstoqueInventarioRepository } from '../domain/repositories/estoque-inventario';
import { InventarioDto } from '../domain/dtos/invetario.interface';

export class GetInventariosByCenterAndData {
  constructor(
    @Inject('IEstoqueInventarioRepository')
    private readonly estoqueInventarioRepository: IEstoqueInventarioRepository,
  ) {}
  async execute(centerId: string, data: string): Promise<InventarioDto[]> {
    return await this.estoqueInventarioRepository.getByCenterAndData(
      centerId,
      data,
    );
  }
}
