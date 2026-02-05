import { Inject, Injectable } from '@nestjs/common';
import { type IRavexRepository } from '../repositories/ravex.repository';
import { ReturnInfoGeralRavex } from '../dto/returnInfoGeralRavex';

@Injectable()
export class GetInfoApenasViagem {
  constructor(
    @Inject('IRavexRepository')
    private readonly ravexRepository: IRavexRepository,
  ) {}

  async execute(viagemId: string): Promise<ReturnInfoGeralRavex> {
    const login = process.env.LOGIN_RAVEX || '';
    const senha = process.env.SENHA_RAVEX || '';
    if (!login || !senha) {
      throw new Error('Login e senha não encontrados');
    }
    const ravex = await this.ravexRepository.authRavex(login, senha);
    if (!ravex) {
      throw new Error('Login e senha não encontrados');
    }

    const ravexViagemGeral = await this.ravexRepository.getRavexViagemId(
      viagemId,
      ravex?.access_token || '',
    );

    if (!ravexViagemGeral) {
      throw new Error('Ravex viagem geral não encontrado');
    }

    return {
      idViagem: viagemId,
      placa: ravexViagemGeral.data.veiculo?.placa || '',
      motorista: ravexViagemGeral.data.motorista?.nome || '',
      transportadora: ravexViagemGeral.data.transportadora?.nome || '',
      transporte: ravexViagemGeral.data.identificador || '',
      notas: [],
    };
  }
}
