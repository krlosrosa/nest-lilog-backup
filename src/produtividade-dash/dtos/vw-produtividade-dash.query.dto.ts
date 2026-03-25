import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const vwProdutividadeDashQuerySchema = z
  .object({
    centerId: z.string().min(1, 'centerId é obrigatório'),
    dataInicial: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'dataInicial deve ser YYYY-MM-DD'),
    dataFinal: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'dataFinal deve ser YYYY-MM-DD'),
  })
  .refine((d) => d.dataInicial <= d.dataFinal, {
    message: 'dataInicial não pode ser maior que dataFinal',
    path: ['dataFinal'],
  });

export type VwProdutividadeDashQuery = z.infer<
  typeof vwProdutividadeDashQuerySchema
>;

export class VwProdutividadeDashQueryDto extends createZodDto(
  vwProdutividadeDashQuerySchema,
) {}
