import { ok } from '../../common/utils/response.js';
import { adminService } from './admin.service.js';

export const adminController = {
  overview(_req, res) {
    return ok(res, adminService.getOverview());
  },
  products(_req, res) {
    return ok(res, adminService.listProducts());
  },
  updateProduct(req, res) {
    return ok(res, adminService.updateProduct(req.validated.params.id, req.validated.body), '商品信息已更新');
  },
  orders(_req, res) {
    return ok(res, adminService.listOrders());
  },
  updateOrderStatus(req, res) {
    return ok(
      res,
      adminService.updateOrderStatus(req.validated.params.id, req.validated.body.status),
      '订单状态已更新'
    );
  },
  feedback(_req, res) {
    return ok(res, adminService.listFeedback());
  },
  updateFeedbackStatus(req, res) {
    return ok(
      res,
      adminService.updateFeedbackStatus(req.validated.params.id, req.validated.body.status),
      '反馈状态已更新'
    );
  }
};
