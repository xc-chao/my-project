import { z } from 'zod';

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99),
    size: z.string().min(1)
  }),
  query: z.any(),
  params: z.any()
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1).max(99)
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const removeCartItemSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});
