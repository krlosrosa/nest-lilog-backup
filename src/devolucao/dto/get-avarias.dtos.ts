import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const getAvariaSchema = z.object({
  data: z.string(),
  id: z.number(),
  demandaId: z.number(),
  placa: z.string(),
  transportadora: z.string(),
  sku: z.string(),
  lote: z.string(),
  descricao: z.string(),
  avaria: z.string(),
  quantidadeCaixas: z.number(),
  quantidadeUnidades: z.number(),
  urls: z.array(z.string()).optional().nullable(),
});

export class GetAvariaDto extends createZodDto(getAvariaSchema) {}
