import { z } from 'zod';

const addressBodySchema = z.object({
  name: z.string().min(1).max(50),
  phone: z.string().regex(/^\d{6,20}$/),
  region: z.string().min(1).max(120),
  detail: z.string().min(1).max(255),
  isDefault: z.boolean().optional()
});

export const addressCreateSchema = z.object({
  body: addressBodySchema,
  query: z.any(),
  params: z.any()
});

export const addressUpdateSchema = z.object({
  body: addressBodySchema,
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const addressRemoveSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});
