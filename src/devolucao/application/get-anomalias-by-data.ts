import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { GetAnomaliasDto } from '../dto/get-anomalias.dto';
import { viewDevolucaoRelatorioAnomalias } from 'src/_shared/infra/drizzle';
import { and, eq, gte, lte, sql } from 'drizzle-orm';

@Injectable()
export class GetAnomaliasByData {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(
    dataInicio: string,
    dataFim: string,
    centerId: string,
  ): Promise<GetAnomaliasDto[]> {
    // Buscar itens com join em demanda para filtrar por data e centerId
    const itensComDemanda = await this.db
      .select()
      .from(viewDevolucaoRelatorioAnomalias)
      .where(
        and(
          eq(viewDevolucaoRelatorioAnomalias.centerId, centerId),
          gte(
            sql`${viewDevolucaoRelatorioAnomalias.data}::date`,
            sql`${dataInicio}::date`,
          ),
          lte(
            sql`${viewDevolucaoRelatorioAnomalias.data}::date`,
            sql`${dataFim}::date`,
          ),
        ),
      );

    return itensComDemanda.map((item) => ({
      ...item,
      data: item.data ?? '',
      id: item.id ?? 0,
      nfs: item.nfs ?? '',
      placa: item.placa ?? '',
      transportadora: item.transportadora ?? '',
      sku: item.sku ?? '',
      descricao: item.descricao ?? '',
      caixas: item.caixas ?? 0,
      unidades: item.unidades ?? 0,
      status: (item.status as 'AVARIA' | 'FALTA' | 'SOBRA') ?? 'FALTA',
      obs: item.obs ?? '',
      empresa: item.empresa ?? '',
      nfsParciais: item.nfsParciais ?? '',
    }));
  }
}
