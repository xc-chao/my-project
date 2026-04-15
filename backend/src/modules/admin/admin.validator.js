import { z } from 'zod';

const productBodySchema = z.object({
  title: z.string().min(1).max(60),
  subtitle: z.string().min(1).max(40),
  category: z.string().min(1).max(20),
  price: z.number().min(0),
  originalPrice: z.number().min(0),
  stock: z.number().int().min(0),
  cover: z.string().min(1),
  badges: z.array(z.string().min(1)).max(8),
  sizes: z.array(z.string().min(1)).max(12),
  detail: z.string().min(1).max(500),
  gallery: z.array(z.string().min(1)).max(8),
  saleStatus: z.enum(['on_sale', 'off_shelf'])
});

export const adminListSchema = z.object({
  body: z.any(),
  query: z.object({}).passthrough(),
  params: z.any()
});

export const adminProductUpdateSchema = z.object({
  body: productBodySchema.partial(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const adminProductCreateSchema = z.object({
  body: productBodySchema,
  query: z.any(),
  params: z.any()
});

export const adminProductDetailSchema = z.object({
  body: z.any(),
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

export const adminOrderLogisticsSchema = z.object({
  body: z.object({
    carrier: z.string().min(1).max(30),
    trackingNo: z.string().min(4).max(40)
  }),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const adminOrderDetailSchema = z.object({
  body: z.any(),
  query: z.any(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const adminAfterSaleListSchema = z.object({
  body: z.any(),
  query: z.object({
    orderId: z.string().optional()
  }).passthrough(),
  params: z.any()
});

export const adminAfterSaleStatusSchema = z.object({
  body: z.object({
    status: z.enum(['submitted', 'reviewing', 'approved', 'rejected'])
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
