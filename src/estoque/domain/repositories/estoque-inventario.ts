import { InventarioDto } from '../dtos/invetario.interface';

export interface IEstoqueInventarioRepository {
  create(centerId: string, inventario: InventarioDto): Promise<string>;
  update(
    inventarioId: string,
    inventario: Partial<InventarioDto>,
  ): Promise<string>;
  delete(inventarioId: string): Promise<void>;
  getById(inventarioId: string): Promise<InventarioDto | null>;
  getByCenterAndData(centerId: string, data: string): Promise<InventarioDto[]>;
}
