import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const getFisicoSchema = z.object({
  data: z.string(),
  id: z.number(),
  sku: z.string(),
  lote: z.string(),
  descricao: z.string(),
  caixas: z.number(),
  unidades: z.number(),
  avariaCaixas: z.number(),
  avariaUnidades: z.number(),
  saldoCaixas: z.number(),
  saldoUnidades: z.number(),
});

export class GetFisicoDto extends createZodDto(getFisicoSchema) {}
