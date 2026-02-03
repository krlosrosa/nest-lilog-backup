import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const InventarioSchema = z.object({
  id: z.number(),
  centerId: z.string(),
  descricao: z.string().optional().nullable(),
  tipo: z.string(),
  status: z.string(),
});

export class InventarioDto extends createZodDto(InventarioSchema) {}
