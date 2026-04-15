export interface ProductItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  stock: number;
  sales: number;
  category: string;
  cover: string;
  badges: string[];
  sizes: string[];
  detail: string;
  gallery?: string[];
  saleStatus?: 'on_sale' | 'off_shelf';
}

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  nickname: string;
  phone: string;
  avatar: string;
  role: UserRole;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size: string;
}

export interface AddressItem {
  id: string;
  name: string;
  phone: string;
  region: string;
  detail: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  status: 'pending_payment' | 'pending_shipping' | 'shipped' | 'completed' | 'cancelled';
  amount: number;
  createdAt: string;
  items: CartItem[];
  logistics?: {
    carrier: string;
    trackingNo: string;
    updatedAt: string;
  } | null;
  timeline?: Array<{
    id: string;
    time: string;
    title: string;
    desc: string;
  }>;
}

export interface AfterSaleItem {
  id: string;
  orderId: string;
  productTitle: string;
  reason: string;
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected';
  userName?: string;
  createdAt?: string;
}

export interface AdminFeedbackItem {
  id: string;
  userName: string;
  productTitle: string;
  summary: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export type AdminTrendRange = '7d' | '30d';

export interface AdminTrendPoint {
  label: string;
  value: number;
}

export interface AdminRankItem {
  label: string;
  value: number;
  note?: string;
}

export interface AdminOverview {
  charts: {
    orderTrend: Record<AdminTrendRange, AdminTrendPoint[]>;
    agentTrend: Record<AdminTrendRange, AdminTrendPoint[]>;
  };
  rankings: {
    categorySales: AdminRankItem[];
    afterSaleReasons: AdminRankItem[];
  };
  metrics: Array<{
    label: string;
    value: string;
    hint: string;
    accent?: 'default' | 'danger';
  }>;
  modules: Array<{
    key: 'product' | 'order' | 'feedback';
    title: string;
    desc: string;
    value: string;
    hint: string;
  }>;
  hotProducts: Array<{
    id: string;
    title: string;
    sales: number;
    stock: number;
  }>;
  feedbacks: AdminFeedbackItem[];
  monitor: {
    todayCalls: number;
    fallbackCount: number;
    successRate: number;
    avgLatencyMs: number;
  };
}
