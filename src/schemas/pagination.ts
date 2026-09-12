import { z } from "zod";

export const paginationInputSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(5),
});

export type PaginationInput = z.infer<typeof paginationInputSchema>;
