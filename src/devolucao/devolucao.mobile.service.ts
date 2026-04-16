import { Inject, Injectable } from '@nestjs/common';
import { and, eq, or } from 'drizzle-orm';
import {
  devolucaImagens,
  devolucaoCheckList,
  devolucaoDemanda,
  devolucaoNotas,
} from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { MinioService } from 'src/_shared/infra/minio/minio.service';
import { ListarDemandasDto } from './dto/demanda/listar-demandas.dto';
import { AddCheckListDto } from './dto/mobile/checkList.dto';
import { parseBase64Image } from './utils/convertImage';
import { EntradaDto, ItensContabilDto } from './dto/mobile/itensContabil.dto';
import { agruparPorTipoSkuEDevolucao } from './utils/agruparESomarItens';

@Injectable()
export class DevolucaoMobileService {
  constructor(
    @Inject(MinioService)
    private readonly minioService: MinioService,
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
  ) {}

  async addCheckList(info: AddCheckListDto, demandaId: string): Promise<void> {
    const bauAberto = parseBase64Image(info.fotoBauAberto);
    const bauFechado = parseBase64Image(info.fotoBauFechado);

    const extAberto = bauAberto.type.split('/')[1] ?? 'webp';
    const extFechado = bauFechado.type.split('/')[1] ?? 'webp';
    const fileNameAberto = `${demandaId}-bau-aberto.${extAberto}`;
    const fileNameFechado = `${demandaId}-bau-fechado.${extFechado}`;

    await this.minioService.upload(
      'devolucaochecklist',
      fileNameAberto,
      Buffer.from(await bauAberto.arrayBuffer()),
      bauAberto.type,
    );

    await this.minioService.upload(
      'devolucaochecklist',
      fileNameFechado,
      Buffer.from(await bauFechado.arrayBuffer()),
      bauFechado.type,
    );

    const urls = [fileNameAberto, fileNameFechado];

    const inserImgs = urls.map((url) => ({
      demandaId: Number(demandaId),
      processo: 'devolucao-check-list',
      tag: url,
    }));

    await this.db.transaction(async (tx) => {
      await tx.insert(devolucaoCheckList).values({
        demandaId: Number(demandaId),
        temperaturaBau: Number(info.temperaturaBau),
        temperaturaProduto: Number(info.temperaturaProduto),
        anomalias: [],
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      });
      await tx.insert(devolucaImagens).values(inserImgs);
    });
  }

  async startDemanda(demandaId: string, accountId: string): Promise<void> {
    await this.db
      .update(devolucaoDemanda)
      .set({
        status: 'EM_CONFERENCIA',
        inicioConferenciaEm: new Date().toISOString(),
        conferenteId: accountId,
      })
      .where(eq(devolucaoDemanda.id, Number(demandaId)));
  }

  async listarDemandasEmAberto(
    centerId: string,
    accountId: string,
  ): Promise<ListarDemandasDto[]> {
    return this.db
      .select()
      .from(devolucaoDemanda)
      .where(
        and(
          eq(devolucaoDemanda.centerId, centerId),
          or(
            and(
              eq(devolucaoDemanda.status, 'EM_CONFERENCIA'),
              eq(devolucaoDemanda.conferenteId, accountId),
            ),
            eq(devolucaoDemanda.status, 'AGUARDANDO_CONFERENCIA'),
          ),
        ),
      );
  }

  async getItensContabilizados(demandaId: string): Promise<ItensContabilDto[]> {
    const itens = await this.db.query.devolucaoNotas.findMany({
      where: eq(devolucaoNotas.devolucaoDemandaId, Number(demandaId)),
      with: {
        devolucaoItens: true,
      },
    });

    const subItens: EntradaDto[] = itens.flatMap((d) => {
      return d.devolucaoItens.map((i) => {
        return {
          ...i,
          tipoDevolucao: d.tipo === 'REENTREGA' ? 'REENTREGA' : 'RETORNO',
        };
      });
    });
    const itensAgrupados = agruparPorTipoSkuEDevolucao(subItens);

    return itensAgrupados;
  }
}
