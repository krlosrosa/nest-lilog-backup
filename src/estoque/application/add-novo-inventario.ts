import { Inject } from '@nestjs/common';
import { InventarioDto } from '../domain/dtos/invetario.interface';
import { type IEstoqueInventarioRepository } from '../domain/repositories/estoque-inventario';

export class AddNovoInventario {
  constructor(
    @Inject('IEstoqueInventarioRepository')
    private readonly estoqueInventarioRepository: IEstoqueInventarioRepository,
  ) {}
  async execute(centerId: string, inventario: InventarioDto): Promise<string> {
    return await this.estoqueInventarioRepository.create(centerId, inventario);
  }
}
