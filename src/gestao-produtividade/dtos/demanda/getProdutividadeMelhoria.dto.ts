import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const getProdutividadeMelhoriaSchema = z.object({
  data: z.string(),
  id_funcionario: z.string(),
  unidade: z.string(),
  nome_funcionario: z.string(),
  turno: z.string(),
  caixas: z.number(),
});

export class GetProdutividadeMelhoriaDto extends createZodDto(
  getProdutividadeMelhoriaSchema,
) {}
