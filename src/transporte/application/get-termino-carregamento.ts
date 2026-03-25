import { Inject, Injectable } from '@nestjs/common';
import { viewTerminoCarregamento } from 'src/_shared/infra/drizzle/migrations/schema';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { type TerminoCarregamentoQuery } from '../dto/termino-carregamento.query.dto';
import { type TerminoCarregamentoGetData } from '../dto/termino-carregamento.get.dto';
import { and, eq, gte, lte, sql } from 'drizzle-orm';

@Injectable()
export class GetTerminoCarregamento {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(
    params: TerminoCarregamentoQuery,
  ): Promise<TerminoCarregamentoGetData[]> {
    return await this.db
      .select()
      .from(viewTerminoCarregamento)
      .where(
        and(
          eq(viewTerminoCarregamento.centerId, params.centerId),
          gte(
            sql`${viewTerminoCarregamento.dataExpedicao}::date`,
            sql`${params.dataInicial}::date`,
          ),
          lte(
            sql`${viewTerminoCarregamento.dataExpedicao}::date`,
            sql`${params.dataFinal}::date`,
          ),
        ),
      );
  }
}
