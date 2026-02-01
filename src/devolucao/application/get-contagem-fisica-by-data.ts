import { Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';

import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { GetContagemFisicaDto } from '../dto/get-contagem-fisica.dto';
import { viewDevolucaoResumoFisico } from 'src/_shared/infra/drizzle';

export class GetContagemFisicaByData {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(
    dataInicio: string,
    dataFim: string,
    centerId: string,
  ): Promise<GetContagemFisicaDto[]> {
    const contagemFisica = await this.db
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
    return contagemFisica.map((item) => ({
      ...item,
      data_criacao: item.dataCriacao ?? '',
      centerId: item.centerId ?? '',
      idemanda: item.idemanda ?? 0,
      sku: item.sku ?? '',
      descricao: item.descricao ?? '',
      lote: item.lote ?? '',
      quantidadeCaixas: item.quantidadeCaixas ?? 0,
      quantidadeUnidades: item.quantidadeUnidades ?? 0,
      quantidadeCaixasAvariadas: item.quantidadeCaixasAvariadas ?? 0,
      quantidadeUnidadesAvariadas: item.quantidadeUnidadesAvariadas ?? 0,
      diferencaCaixas: item.diferencaCaixas ?? 0,
      diferencaUnidades: item.diferencaUnidades ?? 0,
    }));
  }
}
