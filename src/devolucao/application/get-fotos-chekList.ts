import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { Inject, Injectable } from '@nestjs/common';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { MinioService } from 'src/_shared/infra/minio/minio.service';
import { devolucaImagens } from 'src/_shared/infra/drizzle';
import { and, asc, eq, or } from 'drizzle-orm';
import { normalizeMinioObjectKey } from '../utils/normalize-minio-object-key';

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
          or(
            eq(devolucaImagens.processo, 'devolucao-check-list'),
            eq(devolucaImagens.processo, 'devolucao'),
          ),
        ),
      )
      .orderBy(asc(devolucaImagens.id));
    return await Promise.all(
      fotos.map(async (foto, index) => {
        let objectKey = normalizeMinioObjectKey(foto.tag, bucketName);
        const clean = objectKey.replace(/^"|"$/g, '');
        if (/^[a-f0-9]{32}$/i.test(clean)) {
          objectKey = `${demandaId}-bau-${index === 0 ? 'aberto' : 'fechado'}.webp`;
        }
        return this.minioService.presignedGetObject(
          bucketName,
          objectKey,
          expiry,
        );
      }),
    );
  }
}
