import { z } from 'zod';

export const orderCreateSchema = z.object({
  body: z.object({
    addressId: z.string().min(1).optional(),
    remark: z.string().max(100).optional()
  }),
  query: z.any(),
  params: z.any()
});

export const orderDetailSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});
