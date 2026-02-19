import { Inject } from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from '../domain/repository/IDemandaProdutividade.repository';
import { GetProdutividadeMelhoriaDto } from '../dtos/demanda/getProdutividadeMelhoria.dto';

export class GetProdutividadeMelhoriaContinua {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly produtividadeRepository: IDemandaProdutividadeRepository,
  ) {}
  async execute(
    dataInicial: string,
    dataFinal: string,
  ): Promise<GetProdutividadeMelhoriaDto[]> {
    const produtividade =
      await this.produtividadeRepository.findProdutividadeMelhoriaContinua(
        dataInicial,
        dataFinal,
      );
    return produtividade;
  }
}
