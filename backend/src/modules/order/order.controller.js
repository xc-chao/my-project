import { ok } from '../../common/utils/response.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { AppError } from '../../common/errors/AppError.js';
import { orderService } from './order.service.js';

export const orderController = {
  preview: asyncHandler(async (req, res) => {
    return ok(res, await orderService.getPreview(req.user.userId));
  }),
  create: asyncHandler(async (req, res) => {
    return ok(res, await orderService.createOrder(req.user.userId, req.validated.body), '订单已创建');
  }),
  list: asyncHandler(async (req, res) => {
    return ok(res, await orderService.listOrders(req.user.userId));
  }),
  detail: asyncHandler(async (req, res) => {
    const order = await orderService.getOrderDetail(req.validated.params.id, req.user.userId);

    if (!order) {
      throw new AppError(404, 'ORDER_NOT_FOUND', '订单不存在');
    }

    return ok(res, order);
  })
};
