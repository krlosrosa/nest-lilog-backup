import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import {
  ItensDto,
  NotasDto,
  ResultadoDemandaDto,
} from '../dto/demanda/resultado-demanda.dto';
import { eq } from 'drizzle-orm';
import {
  devolucaoDemanda,
  devolucaoNotas,
  viewCheklistAvaria,
  viewResultadoDemandaItens,
} from 'src/_shared/infra/drizzle';
import { TipoDevolucaoNotas } from 'src/_shared/enums/devolucao/devolucao.type';

@Injectable()
export class GetResultadoDemanda {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(demandaId: number): Promise<ResultadoDemandaDto> {
    const demanda = await this.db.query.devolucaoDemanda.findFirst({
      where: eq(devolucaoDemanda.id, demandaId),
      with: {
        user_conferenteId: true,
        user_adicionadoPorId: true,
        devolucaoCheckLists: true,
      },
    });

    const notasBanco = await this.db.query.devolucaoNotas.findMany({
      where: eq(devolucaoNotas.devolucaoDemandaId, demandaId),
    });

    const anomalias = await this.db
      .select()
      .from(viewCheklistAvaria)
      .where(eq(viewCheklistAvaria.demandaId, demandaId));

    const itensBanco = await this.db
      .select()
      .from(viewResultadoDemandaItens)
      .where(eq(viewResultadoDemandaItens.demandaId, demandaId));

    const itens: ItensDto[] = itensBanco.map((item) => ({
      sku: item.sku ?? '',
      descricao: item.descricao ?? '',
      quantidadeCaixasContabil: item.quantidadeCaixasContabil ?? 0,
      quantidadeUnidadesContabil: item.quantidadeUnidadesContabil ?? 0,
      quantidadeCaixasFisico: item.quantidadeCaixasFisico ?? 0,
      quantidadeUnidadesFisico: item.quantidadeUnidadesFisico ?? 0,
      saldoCaixas: item.saldoCaixas ?? 0,
      saldoUnidades: item.saldoUnidades ?? 0,
      avariaCaixas:
        anomalias
          .filter((produto) => produto.sku === item.sku)
          .reduce((acc, curr) => acc + (curr.quantidadeCaixas ?? 0), 0) ?? 0,
      avariaUnidades:
        anomalias
          .filter((produto) => produto.sku === item.sku)
          .reduce((acc, curr) => acc + (curr.quantidadeUnidades ?? 0), 0) ?? 0,
    }));

    const notas: NotasDto[] = notasBanco.map((nota) => ({
      notaFiscal: nota.notaFiscal,
      notaFiscalParcial: nota.nfParcial ?? '',
      descMotivoDevolucao: nota.descMotivoDevolucao ?? '',
      viagemId: nota.idViagemRavex ?? '',
      tipo: nota.tipo as TipoDevolucaoNotas,
    }));

    return {
      demandaId: demandaId,
      placa: demanda?.placa ?? '',
      motorista: demanda?.motorista ?? '',
      temperaturaBau: demanda?.devolucaoCheckLists?.[0]?.temperaturaBau ?? 0,
      temperaturaProduto:
        demanda?.devolucaoCheckLists?.[0]?.temperaturaProduto ?? 0,
      transportadora: demanda?.idTransportadora ?? '',
      doca: demanda?.doca ?? '',
      criadoPor: demanda?.user_adicionadoPorId?.name ?? '',
      conferente: demanda?.user_conferenteId?.name ?? '',
      criadoEm: demanda?.criadoEm ?? '',
      LiberadoParaConferenciaEm: demanda?.liberadoParaConferenciaEm ?? '',
      InicioConferenciaEm: demanda?.inicioConferenciaEm ?? '',
      FimConferenciaEm: demanda?.fimConferenciaEm ?? '',
      FinalizadoEm: demanda?.finalizadoEm ?? '',
      Status: demanda?.status ?? '',
      FechouComAnomalia: demanda?.fechouComAnomalia ?? false,
      transporte: demanda?.transporte ?? '',
      notas: notas,
      itens: itens,
    };
  }
}
