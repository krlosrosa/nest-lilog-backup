import { createSelectSchema } from 'drizzle-zod';
import { viewTerminoCarregamento } from 'src/_shared/infra/drizzle/migrations/schema';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const getTerminoCarregamentoSchema = createSelectSchema(
  viewTerminoCarregamento,
);

export type TerminoCarregamentoGetData = z.infer<
  typeof getTerminoCarregamentoSchema
>;

export class TerminoCarregamentoGetDto extends createZodDto(
  getTerminoCarregamentoSchema,
) {}
