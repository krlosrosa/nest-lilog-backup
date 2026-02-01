import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const getNotaByDataSchema = z.object({
  data: z.string(),
  demandaId: z.number(),
  notaFiscal: z.string(),
  notaFiscalParcial: z.string(),
  motivoDevolucao: z.string(),
  statusDemanda: z.string(),
  placa: z.string(),
  transportadora: z.string(),
  conferente: z.string(),
});

export class GetNotaByDataDto extends createZodDto(getNotaByDataSchema) {}
