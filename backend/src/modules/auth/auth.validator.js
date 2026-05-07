import { z } from 'zod';

export const wechatLoginSchema = z.object({
  body: z.object({
    code: z.string().min(1)
  }),
  query: z.any(),
  params: z.any()
});

export const devLoginSchema = z.object({
  body: z.object({
    role: z.enum(['user', 'admin']).default('user')
  }),
  query: z.any(),
  params: z.any()
});

export const smsCodeSchema = z.object({
  body: z.object({
    phone: z.string().regex(/^1\d{10}$/)
  }),
  query: z.any(),
  params: z.any()
});

export const smsLoginSchema = z.object({
  body: z.object({
    phone: z.string().regex(/^1\d{10}$/),
    code: z.string().length(6),
    identity: z.enum(['user', 'admin']).optional()
  }),
  query: z.any(),
  params: z.any()
});

export const profileUpdateSchema = z.object({
  body: z.object({
    nickname: z.string().min(1).max(20).optional(),
    avatar: z.string().min(1).optional(),
    role: z.enum(['user', 'admin']).optional()
  }),
  query: z.any(),
  params: z.any()
});
