import { z } from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    productId: z.string().min(1)
  }),
  query: z.any(),
  params: z.any()
});

export const sendMessageSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    question: z.string().min(1).max(500)
  }),
  query: z.any(),
  params: z.any()
});
