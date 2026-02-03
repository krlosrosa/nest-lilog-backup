import { Inject } from '@nestjs/common';
import { type IEstoqueInventarioRepository } from '../domain/repositories/estoque-inventario';

export class DeletarInventario {
  constructor(
    @Inject('IEstoqueInventarioRepository')
    private readonly estoqueInventarioRepository: IEstoqueInventarioRepository,
  ) {}
  async execute(inventarioId: string): Promise<void> {
    return await this.estoqueInventarioRepository.delete(inventarioId);
  }
}
