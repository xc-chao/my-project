import { z } from 'zod';

export const wechatLoginSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    nickname: z.string().min(1).max(20).optional()
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
    code: z.string().length(6)
  }),
  query: z.any(),
  params: z.any()
});
