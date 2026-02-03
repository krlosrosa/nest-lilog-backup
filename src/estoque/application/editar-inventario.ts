import { Inject } from '@nestjs/common';
import { type IEstoqueInventarioRepository } from '../domain/repositories/estoque-inventario';
import { InventarioDto } from '../domain/dtos/invetario.interface';

export class EditarInventario {
  constructor(
    @Inject('IEstoqueInventarioRepository')
    private readonly estoqueInventarioRepository: IEstoqueInventarioRepository,
  ) {}
  async execute(id: string, inventario: InventarioDto): Promise<string> {
    return await this.estoqueInventarioRepository.update(id, inventario);
  }
}
