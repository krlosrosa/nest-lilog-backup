import { Inject } from '@nestjs/common';
import { IEstoqueInventarioRepository } from '../domain/repositories/estoque-inventario';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { InventarioDto } from '../domain/dtos/invetario.interface';
import { estoqueInventario } from 'src/_shared/infra/drizzle';
import { and, eq, sql } from 'drizzle-orm';

export class EstoqueInventarioRepository
  implements IEstoqueInventarioRepository
{
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(centerId: string, inventario: InventarioDto): Promise<string> {
    const [result] = await this.db
      .insert(estoqueInventario)
      .values({
        centerId: centerId,
        descricao: inventario.descricao ?? '',
        tipo: inventario.tipo,
        status: inventario.status.toString(),
      })
      .returning();
    return result?.id.toString() ?? '';
  }

  async update(
    inventarioId: string,
    inventario: Partial<InventarioDto>,
  ): Promise<string> {
    const [result] = await this.db
      .update(estoqueInventario)
      .set(inventario)
      .where(eq(estoqueInventario.id, Number(inventarioId)))
      .returning();
    return result?.id.toString() ?? '';
  }

  async delete(inventarioId: string): Promise<void> {
    await this.db
      .delete(estoqueInventario)
      .where(eq(estoqueInventario.id, Number(inventarioId)));
    return Promise.resolve();
  }

  async getById(inventarioId: string): Promise<InventarioDto | null> {
    const [result] = await this.db
      .select()
      .from(estoqueInventario)
      .where(eq(estoqueInventario.id, Number(inventarioId)));

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      centerId: result.centerId ?? '',
      descricao: result.descricao,
      tipo: result.tipo ?? '',
      status: result.status ?? '',
    };
  }

  async getByCenterAndData(
    centerId: string,
    data: string,
  ): Promise<InventarioDto[]> {
    const resultados = await this.db
      .select()
      .from(estoqueInventario)
      .where(
        and(
          eq(estoqueInventario.centerId, centerId),
          sql`${estoqueInventario.dataCriacao}::date = ${data}`,
        ),
      );
    return resultados.map((resultado) => ({
      id: resultado.id,
      centerId: resultado.centerId ?? '',
      descricao: resultado.descricao ?? '',
      tipo: resultado.tipo ?? '',
      status: resultado.status ?? '',
    }));
  }
}
