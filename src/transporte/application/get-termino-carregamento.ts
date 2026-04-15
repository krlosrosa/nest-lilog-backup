import { Inject, Injectable } from '@nestjs/common';
import {
  historicoStatusTransporte,
  transporte,
} from 'src/_shared/infra/drizzle/migrations/schema';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { type TerminoCarregamentoQuery } from '../dto/termino-carregamento.query.dto';
import { type TerminoCarregamentoGetData } from '../dto/termino-carregamento.get.dto';
import { TipoEvento } from 'src/_shared/enums/tipoEvento.enum';
import { and, eq, sql } from 'drizzle-orm';

/** Data de expedição e horário de término em calendário/relógio America/Sao_Paulo (não UTC). */
const dataExpedicaoDiaLocal = sql`((${transporte.dataExpedicao}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo')::date)`;

const horarioTerminoLocal = sql<string>`(${historicoStatusTransporte.alteradoEm}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo')`.as(
  'horario_termino_carregamento',
);

const dataExpedicaoLocal = sql<string>`(${transporte.dataExpedicao}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo')::date`.as(
  'data_expedicao',
);

@Injectable()
export class GetTerminoCarregamento {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(
    params: TerminoCarregamentoQuery,
  ): Promise<TerminoCarregamentoGetData[]> {
    return await this.db
      .select({
        horarioTerminoCarregamento: horarioTerminoLocal,
        numeroTransporte: transporte.numeroTransporte,
        dataExpedicao: dataExpedicaoLocal,
        centerId: transporte.centerId,
      })
      .from(historicoStatusTransporte)
      .innerJoin(
        transporte,
        eq(historicoStatusTransporte.transporteId, transporte.numeroTransporte),
      )
      .where(
        and(
          eq(
            historicoStatusTransporte.tipoEvento,
            TipoEvento.TERMINO_CARREGAMENTO,
          ),
          eq(transporte.centerId, params.centerId),
          sql`${dataExpedicaoDiaLocal} >= ${params.dataInicial}::date`,
          sql`${dataExpedicaoDiaLocal} <= ${params.dataFinal}::date`,
        ),
      );
  }
}
