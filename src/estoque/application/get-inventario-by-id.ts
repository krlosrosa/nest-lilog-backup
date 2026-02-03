import { Inject, NotFoundException } from '@nestjs/common';
import { type IEstoqueInventarioRepository } from '../domain/repositories/estoque-inventario';
import { InventarioDto } from '../domain/dtos/invetario.interface';

export class GetInventarioById {
  constructor(
    @Inject('IEstoqueInventarioRepository')
    private readonly estoqueInventarioRepository: IEstoqueInventarioRepository,
  ) {}
  async execute(inventarioId: string): Promise<InventarioDto> {
    const inventario =
      await this.estoqueInventarioRepository.getById(inventarioId);
    if (!inventario) {
      throw new NotFoundException('Inventário não encontrado');
    }
    return inventario;
  }
}
