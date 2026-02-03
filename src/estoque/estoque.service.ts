import { Inject, Injectable } from '@nestjs/common';
import { GetInventariosByCenterAndData } from './application/get-inventarios-by-center-and-data';
import { InventarioDto } from './domain/dtos/invetario.interface';
import { AddNovoInventario } from './application/add-novo-inventario';
import { EditarInventario } from './application/editar-inventario';
import { DeletarInventario } from './application/delete-inventario';
import { GetInventarioById } from './application/get-inventario-by-id';

@Injectable()
export class EstoqueService {
  constructor(
    @Inject(GetInventariosByCenterAndData)
    private readonly getInventariosByCenterAndDataUsecase: GetInventariosByCenterAndData,
    @Inject(AddNovoInventario)
    private readonly addNovoInventarioUsecase: AddNovoInventario,
    @Inject(EditarInventario)
    private readonly editarInventarioUsecase: EditarInventario,
    @Inject(DeletarInventario)
    private readonly deletarInventarioUsecase: DeletarInventario,
    @Inject(GetInventarioById)
    private readonly getInventarioByIdUsecase: GetInventarioById,
  ) {}

  async getInventariosByCenterAndData(
    centerId: string,
    data: string,
  ): Promise<InventarioDto[]> {
    return this.getInventariosByCenterAndDataUsecase.execute(centerId, data);
  }

  async createInventario(
    centerId: string,
    inventario: InventarioDto,
  ): Promise<string> {
    return this.addNovoInventarioUsecase.execute(centerId, inventario);
  }

  async editarInventario(
    id: string,
    inventario: InventarioDto,
  ): Promise<string> {
    return this.editarInventarioUsecase.execute(id, inventario);
  }

  async deletarInventario(inventarioId: string): Promise<void> {
    return this.deletarInventarioUsecase.execute(inventarioId);
  }

  async getInventarioById(inventarioId: string): Promise<InventarioDto> {
    return this.getInventarioByIdUsecase.execute(inventarioId);
  }
}
