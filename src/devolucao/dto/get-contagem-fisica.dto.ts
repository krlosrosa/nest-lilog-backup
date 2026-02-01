import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const getContagemFisicaSchema = z.object({
  idemanda: z.number(),
  sku: z.string(),
  descricao: z.string(),
  lote: z.string().nullable().optional(), // Lote pode vir nulo dependendo do cadastro
  centerId: z.number().or(z.string()), // Ajuste conforme o tipo do seu ID de centro
  quantidadeCaixas: z.number(),
  quantidadeUnidades: z.number(),

  // Campos agregados/calculados (SQL BigInt/Numeric costumam vir como string em alguns drivers,
  // mas aqui tratamos como number para o DTO)
  quantidadeCaixasAvariadas: z.coerce.number(),
  quantidadeUnidadesAvariadas: z.coerce.number(),
  diferencaCaixas: z.coerce.number(),
  diferencaUnidades: z.coerce.number(),

  // A função date(dd."criadoEm") retorna YYYY-MM-DD
  data_criacao: z.string(),
});

export class GetContagemFisicaDto extends createZodDto(
  getContagemFisicaSchema,
) {}
