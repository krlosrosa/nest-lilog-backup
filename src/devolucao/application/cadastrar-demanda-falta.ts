import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { devolucaoDemanda } from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';

export class CadastrarDemandaFalta {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(demandaId: string, accountId: string): Promise<void> {
    await this.db
      .update(devolucaoDemanda)
      .set({
        status: 'FINALIZADO',
        liberadoParaConferenciaEm: new Date().toISOString(),
        finalizadoEm: new Date().toISOString(),
        conferenteId: accountId,
        inicioConferenciaEm: new Date().toISOString(),
        fimConferenciaEm: new Date().toISOString(),
      })
      .where(eq(devolucaoDemanda.id, Number(demandaId)));
  }
}
