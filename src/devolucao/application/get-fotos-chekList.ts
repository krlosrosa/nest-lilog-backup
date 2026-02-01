import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { Inject, Injectable } from '@nestjs/common';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { MinioService } from 'src/_shared/infra/minio/minio.service';
import { devolucaImagens } from 'src/_shared/infra/drizzle';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class GetFotosCheckList {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
    @Inject(MinioService)
    private readonly minioService: MinioService,
  ) {}

  async execute(demandaId: number): Promise<string[]> {
    const bucketName = 'devolucaochecklist';
    const expiry = 24 * 60 * 60; // 24 horas

    const fotos = await this.db
      .select()
      .from(devolucaImagens)
      .where(
        and(
          eq(devolucaImagens.demandaId, demandaId),
          eq(devolucaImagens.processo, 'devolucao-check-list'),
        ),
      );
    return await Promise.all(
      fotos.map(async (foto) => {
        return this.minioService.presignedGetObject(
          bucketName,
          foto.tag,
          expiry,
        );
      }),
    );
  }
}
