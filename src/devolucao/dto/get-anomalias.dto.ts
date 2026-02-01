import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const getAnomaliasSchema = z.object({
  data: z.string(),
  id: z.number(),
  nfs: z.string(),
  placa: z.string(),
  transportadora: z.string(),
  sku: z.string(),
  descricao: z.string(),
  caixas: z.number(),
  unidades: z.number(),
  status: z.enum(['SOBRA', 'FALTA', 'AVARIA']),
  obs: z.string(),
});

export class GetAnomaliasDto extends createZodDto(getAnomaliasSchema) {}
