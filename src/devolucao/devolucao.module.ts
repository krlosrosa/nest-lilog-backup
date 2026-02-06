import { Module } from '@nestjs/common';
import { DevolucaoService } from './devolucao.service';
import { DevolucaoController } from './devolucao.controller';
import { GetInfoByViagemIdRavex } from './application/getInfoByViagemIdRavex';
import { ProdutoService } from 'src/produto/produto.service';
import { Ravex } from './infra/ravex.infra';
import { GetResultadoDemanda } from './application/getResultadoDemanda';
import { DevolucaoMobileController } from './devolucao.mobile.controller';
import { DevolucaoMobileService } from './devolucao.mobile.service';
import { GetAnomaliasByData } from './application/get-anomalias-by-data';
import { GetFisicoByData } from './application/get-fisico-by-data';
import { GetAvariasById } from './application/get-avarias-by-id';
import { GetNotasByData } from './application/get-notas-by-data';
import { GetContagemFisicaByData } from './application/get-contagem-fisica-by-data';
import { GetFotosCheckList } from './application/get-fotos-chekList';
import { CadastrarDemandaFalta } from './application/cadastrar-demanda-falta';
import { GetInfoApenasViagem } from './application/getInfoApenasViagem';
import { GetFotosFimProcessos } from './application/get-fotos-fim-processos';

@Module({
  providers: [
    DevolucaoService,
    DevolucaoMobileService,
    GetInfoByViagemIdRavex,
    ProdutoService,
    GetResultadoDemanda,
    GetAnomaliasByData,
    GetFisicoByData,
    GetAvariasById,
    GetNotasByData,
    GetContagemFisicaByData,
    GetFotosCheckList,
    CadastrarDemandaFalta,
    GetInfoApenasViagem,
    GetFotosFimProcessos,
    {
      provide: 'IRavexRepository',
      useClass: Ravex,
    },
  ],
  controllers: [DevolucaoController, DevolucaoMobileController],
})
export class DevolucaoModule {}
