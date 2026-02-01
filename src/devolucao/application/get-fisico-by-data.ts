import { Inject, Injectable } from '@nestjs/common';
import { viewDevolucaoResumoFisico } from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { GetFisicoDto } from '../dto/get-fisico.dto';
import { and, eq, gte, lte, sql } from 'drizzle-orm';

@Injectable()
export class GetFisicoByData {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(
    dataInicio: string,
    dataFim: string,
    centerId: string,
  ): Promise<GetFisicoDto[]> {
    // Buscar apenas itens FISICO com join em demanda para filtrar por data e centerId
    const itensFisicos = await this.db
      .select()
      .from(viewDevolucaoResumoFisico)
      .where(
        and(
          eq(viewDevolucaoResumoFisico.centerId, centerId),
          gte(
            sql`${viewDevolucaoResumoFisico.dataCriacao}::date`,
            sql`${dataInicio}::date`,
          ),
          lte(
            sql`${viewDevolucaoResumoFisico.dataCriacao}::date`,
            sql`${dataFim}::date`,
          ),
        ),
      );

    return itensFisicos.map((item) => ({
      ...item,
      data: item.dataCriacao ?? '',
      id: item.idemanda ?? 0,
      sku: item.sku ?? '',
      lote: item.lote ?? '',
      descricao: item.descricao ?? '',
      caixas: item.quantidadeCaixas ?? 0,
      unidades: item.quantidadeUnidades ?? 0,
      avariaCaixas: item.quantidadeCaixasAvariadas ?? 0,
      avariaUnidades: item.quantidadeUnidadesAvariadas ?? 0,
      saldoCaixas: item.diferencaCaixas ?? 0,
      saldoUnidades: item.diferencaUnidades ?? 0,
    }));
  }
}
