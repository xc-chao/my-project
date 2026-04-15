export const name = '004_seed_feedbacks';

const feedbacks = [
  {
    id: 'feedback_001',
    userId: 'u_001',
    productId: 'p_001',
    productTitle: 'Nike Air Jordan 1 Low',
    summary: '希望详情页补充脚感说明与尺码建议。',
    status: 'pending',
    createdAt: '2026-03-10 09:20:00'
  },
  {
    id: 'feedback_002',
    userId: 'u_001',
    productId: 'p_002',
    productTitle: '街头宽松卫衣',
    summary: '搜索筛选建议增加价格区间和 48h 上新选项。',
    status: 'resolved',
    createdAt: '2026-03-09 21:10:00'
  },
  {
    id: 'feedback_003',
    userId: 'u_001',
    productId: 'p_003',
    productTitle: '纯亚麻衬衫',
    summary: '订单物流更新比较及时，售后入口可以再提前。',
    status: 'pending',
    createdAt: '2026-03-09 18:45:00'
  }
];

export async function seed({ pool }) {
  for (const item of feedbacks) {
    await pool.query(
      `
        INSERT INTO feedbacks (
          id,
          user_id,
          product_id,
          product_title,
          summary,
          status,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          user_id = VALUES(user_id),
          product_id = VALUES(product_id),
          product_title = VALUES(product_title),
          summary = VALUES(summary),
          status = VALUES(status),
          created_at = VALUES(created_at),
          updated_at = VALUES(updated_at)
      `,
      [
        item.id,
        item.userId,
        item.productId,
        item.productTitle,
        item.summary,
        item.status,
        item.createdAt,
        item.createdAt
      ]
    );
  }
}
