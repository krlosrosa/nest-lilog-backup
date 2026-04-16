import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { devolucaImagens } from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { MinioService } from 'src/_shared/infra/minio/minio.service';
import { normalizeMinioObjectKey } from '../utils/normalize-minio-object-key';

@Injectable()
export class GetFotosFimProcessos {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
    @Inject(MinioService)
    private readonly minioService: MinioService,
  ) {}
  async execute(demandaId: number): Promise<string[]> {
    const bucketName = 'devolucaoprocessoconcluido';
    const expiry = 24 * 60 * 60; // 24 horas

    const fotos = await this.db
      .select()
      .from(devolucaImagens)
      .where(
        and(
          eq(devolucaImagens.demandaId, demandaId),
          eq(devolucaImagens.processo, 'devolucao-fim'),
        ),
      )
      .orderBy(asc(devolucaImagens.id));
    return await Promise.all(
      fotos.map(async (foto) => {
        const objectKey = normalizeMinioObjectKey(foto.tag, bucketName);
        return this.minioService.presignedGetObject(
          bucketName,
          objectKey,
          expiry,
        );
      }),
    );
  }
}
