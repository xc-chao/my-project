export const name = '003_seed_user_flow';

const defaultAddress = {
  id: 'addr_001',
  userId: 'u_001',
  name: '徐超',
  phone: '13800000000',
  region: '上海市 浦东新区',
  detail: '张江高科软件园 8 号楼 1203 室',
  isDefault: 1
};

const seedOrderId = 'order_seed_001';

const orderTimeline = [
  {
    id: 'timeline_order_seed_001_1',
    createdAt: '2026-03-07 17:42:00',
    title: '订单创建',
    description: '用户提交订单并完成支付。'
  },
  {
    id: 'timeline_order_seed_001_2',
    createdAt: '2026-03-07 18:10:00',
    title: '物流信息已录入',
    description: '承运商为顺丰速运，物流单号 SF1234567890。'
  },
  {
    id: 'timeline_order_seed_001_3',
    createdAt: '2026-03-08 09:30:00',
    title: '订单已发货',
    description: '包裹已从仓库发出，正在配送途中。'
  },
  {
    id: 'timeline_order_seed_001_4',
    createdAt: '2026-03-09 14:10:00',
    title: '订单已完成',
    description: '用户已签收，订单流程完成。'
  }
];

const afterSalesSeed = [
  {
    id: 'after_001',
    status: 'reviewing',
    reason: '外观有轻微划痕',
    createdAt: '2026-03-10 09:20:00'
  },
  {
    id: 'after_002',
    status: 'approved',
    reason: '想确认是否支持换货处理',
    createdAt: '2026-03-09 21:10:00'
  },
  {
    id: 'after_003',
    status: 'submitted',
    reason: '签收后发现包装破损，需进一步审核',
    createdAt: '2026-03-09 18:45:00'
  }
];

export async function seed({ pool }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [productRows] = await connection.query(
      `
        SELECT id, title, cover, price
        FROM products
        WHERE id = 'p_001'
        LIMIT 1
      `
    );
    const product = productRows[0];

    if (!product) {
      throw new Error('Seed product p_001 not found');
    }

    await connection.query(
      `
        INSERT INTO addresses (id, user_id, name, phone, region, detail, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          user_id = VALUES(user_id),
          name = VALUES(name),
          phone = VALUES(phone),
          region = VALUES(region),
          detail = VALUES(detail),
          is_default = VALUES(is_default)
      `,
      [
        defaultAddress.id,
        defaultAddress.userId,
        defaultAddress.name,
        defaultAddress.phone,
        defaultAddress.region,
        defaultAddress.detail,
        defaultAddress.isDefault
      ]
    );

    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [defaultAddress.userId]);

    await connection.query(
      `
        INSERT INTO orders (id, user_id, status, amount, address_id, remark, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          user_id = VALUES(user_id),
          status = VALUES(status),
          amount = VALUES(amount),
          address_id = VALUES(address_id),
          remark = VALUES(remark),
          created_at = VALUES(created_at),
          updated_at = VALUES(updated_at)
      `,
      [
        seedOrderId,
        defaultAddress.userId,
        'completed',
        Number(product.price),
        defaultAddress.id,
        '',
        '2026-03-07 17:42:00',
        '2026-03-09 14:10:00'
      ]
    );

    await connection.query('DELETE FROM order_items WHERE order_id = ?', [seedOrderId]);
    await connection.query('DELETE FROM order_timeline WHERE order_id = ?', [seedOrderId]);
    await connection.query('DELETE FROM order_shipments WHERE order_id = ?', [seedOrderId]);

    await connection.query(
      `
        INSERT INTO order_items (
          id,
          order_id,
          product_id,
          quantity,
          size,
          product_title,
          product_cover,
          product_price,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        'order_item_seed_001_1',
        seedOrderId,
        product.id,
        1,
        '42',
        product.title,
        product.cover,
        Number(product.price),
        '2026-03-07 17:42:00'
      ]
    );

    await connection.query(
      `
        INSERT INTO order_shipments (order_id, carrier, tracking_no, updated_at)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          carrier = VALUES(carrier),
          tracking_no = VALUES(tracking_no),
          updated_at = VALUES(updated_at)
      `,
      [seedOrderId, '顺丰速运', 'SF1234567890', '2026-03-07 18:10:00']
    );

    for (const item of orderTimeline) {
      await connection.query(
        `
          INSERT INTO order_timeline (id, order_id, title, description, created_at)
          VALUES (?, ?, ?, ?, ?)
        `,
        [item.id, seedOrderId, item.title, item.description, item.createdAt]
      );
    }

    for (const item of afterSalesSeed) {
      await connection.query(
        `
          INSERT INTO after_sales (
            id,
            user_id,
            order_id,
            product_id,
            product_title,
            product_cover,
            reason,
            status,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            order_id = VALUES(order_id),
            product_id = VALUES(product_id),
            product_title = VALUES(product_title),
            product_cover = VALUES(product_cover),
            reason = VALUES(reason),
            status = VALUES(status),
            created_at = VALUES(created_at),
            updated_at = VALUES(updated_at)
        `,
        [
          item.id,
          defaultAddress.userId,
          seedOrderId,
          product.id,
          product.title,
          product.cover,
          item.reason,
          item.status,
          item.createdAt,
          item.createdAt
        ]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
