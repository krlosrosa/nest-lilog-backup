import { eq } from 'drizzle-orm';
import { GetAvariaDto } from '../dto/get-avarias.dtos';
import { Inject, Injectable } from '@nestjs/common';
import { viewChecklistAvariaWithFotos } from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { MinioService } from 'src/_shared/infra/minio/minio.service';

@Injectable()
export class GetAvariasById {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
    @Inject(MinioService)
    private readonly minioService: MinioService,
  ) {}

  async execute(demandaId: number): Promise<GetAvariaDto[]> {
    const avarias = await this.db
      .select()
      .from(viewChecklistAvariaWithFotos)
      .where(eq(viewChecklistAvariaWithFotos.demandaId, demandaId));

    if (!avarias) {
      return [];
    }

    const bucketName = 'devolucaoanomalias';
    const expiry = 24 * 60 * 60; // 24 horas

    return await Promise.all(
      avarias.map(async (avaria) => {
        console.log(avaria.sku);
        const imagensArray = avaria?.tag
          ?.toString()
          .split(',')
          .filter(
            (texto) =>
              texto.includes('anomalia') &&
              texto.includes(avaria?.sku ?? 'invalido'),
          );
        const imagens = await Promise.all(
          imagensArray?.map(async (imagem) => {
            return this.minioService.presignedGetObject(
              bucketName,
              imagem,
              expiry,
            );
          }) ?? [],
        );
        return {
          ...avaria,
          data: avaria.criadoEm ?? '',
          id: avaria.id ?? 0,
          demandaId: avaria.demandaId ?? 0,
          avaria: avaria.avaria ?? '',
          placa: avaria.placa ?? '',
          transportadora: avaria.transportadora ?? '',
          sku: avaria.sku ?? '',
          lote: avaria.lote ?? '',
          descricao: avaria.produtoDescricao ?? '',
          quantidadeCaixas: avaria.quantidadeCaixas ?? 0,
          quantidadeUnidades: avaria.quantidadeUnidades ?? 0,
          urls: imagens,
        };
      }),
    );
  }
}
