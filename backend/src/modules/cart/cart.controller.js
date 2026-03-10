import { ok } from '../../common/utils/response.js';
import { cartService } from './cart.service.js';

export const cartController = {
  getCart(_req, res) {
    return ok(res, cartService.getCart());
  },
  addItem(req, res) {
    return ok(res, cartService.addItem(req.validated.body), '已加入购物车');
  },
  updateItem(req, res) {
    return ok(res, cartService.updateItem(req.validated.params.id, req.validated.body.quantity), '购物车已更新');
  },
  removeItem(req, res) {
    return ok(res, cartService.removeItem(req.validated.params.id), '已移除商品');
  }
};
