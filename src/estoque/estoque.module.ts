import { Module } from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { EstoqueController } from './estoque.controller';
import { EstoqueInventarioRepository } from './infra/estoque-inventario.repository';
import { GetInventarioById } from './application/get-inventario-by-id';
import { DeletarInventario } from './application/delete-inventario';
import { EditarInventario } from './application/editar-inventario';
import { AddNovoInventario } from './application/add-novo-inventario';
import { GetInventariosByCenterAndData } from './application/get-inventarios-by-center-and-data';

@Module({
  controllers: [EstoqueController],
  providers: [
    EstoqueService,
    GetInventariosByCenterAndData,
    AddNovoInventario,
    EditarInventario,
    DeletarInventario,
    GetInventarioById,
    {
      provide: 'IEstoqueInventarioRepository',
      useClass: EstoqueInventarioRepository,
    },
  ],
})
export class EstoqueModule {}
