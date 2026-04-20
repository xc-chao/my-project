import { z } from 'zod';

export const feedbackCreateSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    productTitle: z.string().max(160).optional(),
    summary: z.string().min(1).max(500)
  }),
  query: z.any(),
  params: z.any()
});
