import { z } from 'zod';

export const afterSaleCreateSchema = z.object({
  body: z.object({
    orderId: z.string().min(1),
    productTitle: z.string().min(1).max(160),
    reason: z.string().min(1).max(500)
  }),
  query: z.any(),
  params: z.any()
});
