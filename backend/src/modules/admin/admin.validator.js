import { z } from 'zod';

export const adminListSchema = z.object({
  body: z.any(),
  query: z.object({}).passthrough(),
  params: z.any()
});

export const adminProductUpdateSchema = z.object({
  body: z.object({
    saleStatus: z.enum(['on_sale', 'off_shelf']).optional(),
    stock: z.number().int().min(0).optional(),
    price: z.number().min(0).optional()
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const adminOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending_payment', 'pending_shipping', 'shipped', 'completed', 'cancelled'])
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const adminFeedbackStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'resolved'])
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});
