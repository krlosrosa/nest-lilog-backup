import { FindAllParams } from 'src/gestao-produtividade/dtos/params.dto';
import { Demanda } from '../entities/demanda.entity';
import { Palete } from '../entities/palete.entity';
import { OverViewProdutividadeDataDto } from 'src/gestao-produtividade/dtos/produtividade/produtivididade.overView.dto';
import { DemandaProcesso } from 'src/_shared/enums';
import { GetProdutividadeMelhoriaDto } from 'src/gestao-produtividade/dtos/demanda/getProdutividadeMelhoria.dto';

export interface IDemandaProdutividadeRepository {
  findAll(params: FindAllParams): Promise<Demanda[]>;
  findById(idDemanda: string): Promise<Demanda | undefined>;
  findPaletes(paletesId: string[]): Promise<Palete[]>;
  create(demanda: Demanda, paletesIds: string[]): Promise<void>;
  finalizarPalete(paletes: Palete[]): Promise<void>;
  getDemandaByPaleteId(paleteId: string): Promise<Demanda | undefined>;
  finalizarDemandas(demandas: Demanda[]): Promise<void>;
  overViewProdutividade(
    centerId: string,
    processo: DemandaProcesso,
    dataRegistro: string,
  ): Promise<OverViewProdutividadeDataDto>;
  delete(demandaId: number): Promise<void>;
  countPaletesDemanda(id: number): Promise<number>;
  findProdutividadeMelhoriaContinua(
    dataInicial: string,
    dataFinal: string,
  ): Promise<GetProdutividadeMelhoriaDto[]>;
}
