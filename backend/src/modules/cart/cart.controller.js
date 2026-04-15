import { ok } from '../../common/utils/response.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { cartService } from './cart.service.js';

export const cartController = {
  getCart: asyncHandler(async (req, res) => {
    return ok(res, await cartService.getCart(req.user.userId));
  }),
  addItem: asyncHandler(async (req, res) => {
    return ok(res, await cartService.addItem(req.user.userId, req.validated.body), '已加入购物车');
  }),
  updateItem: asyncHandler(async (req, res) => {
    return ok(
      res,
      await cartService.updateItem(req.user.userId, req.validated.params.id, req.validated.body.quantity),
      '购物车已更新'
    );
  }),
  removeItem: asyncHandler(async (req, res) => {
    return ok(res, await cartService.removeItem(req.user.userId, req.validated.params.id), '已移除商品');
  })
};
