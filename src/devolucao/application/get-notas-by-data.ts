import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { viewNotasPorData } from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { GetNotaByDataDto } from '../dto/get-nota-by-data.dto';

@Injectable()
export class GetNotasByData {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(
    dataInicio: string,
    dataFim: string,
    centerId: string,
  ): Promise<GetNotaByDataDto[]> {
    const notas = await this.db
      .select()
      .from(viewNotasPorData)
      .where(
        and(
          eq(viewNotasPorData.centro, centerId),
          gte(sql`${viewNotasPorData.data}::date`, sql`${dataInicio}::date`),
          lte(sql`${viewNotasPorData.data}::date`, sql`${dataFim}::date`),
        ),
      );
    return notas.map((nota) => ({
      ...nota,
      data: nota.data ?? '',
      demandaId: nota.demandaId ?? 0,
      notaFiscal: nota.notaFiscal ?? '',
      notaFiscalParcial: nota.notaFiscalParcial ?? '',
      motivoDevolucao: nota.motivoDevolucao ?? '',
      statusDemanda: nota.statusDemanda ?? '',
      placa: nota.placa ?? '',
      centro: nota.centro ?? '',
      transportadora: nota.transportadora ?? '',
      conferente: nota.conferente ?? '',
    }));
  }
}
