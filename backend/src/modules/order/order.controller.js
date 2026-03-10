import { ok } from '../../common/utils/response.js';
import { AppError } from '../../common/errors/AppError.js';
import { orderService } from './order.service.js';

export const orderController = {
  create(req, res) {
    return ok(res, orderService.createOrder(req.user.userId), '订单已创建');
  },
  list(req, res) {
    return ok(res, orderService.listOrders(req.user.userId));
  },
  detail(req, res) {
    const order = orderService.getOrderDetail(req.params.id, req.user.userId);

    if (!order) {
      throw new AppError(404, 'ORDER_NOT_FOUND', '订单不存在');
    }

    return ok(res, order);
  }
};
