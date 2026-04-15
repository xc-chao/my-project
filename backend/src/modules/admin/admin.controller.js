import { ok } from '../../common/utils/response.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { adminService } from './admin.service.js';

export const adminController = {
  overview: asyncHandler(async (_req, res) => {
    return ok(res, await adminService.getOverview());
  }),
  products: asyncHandler(async (_req, res) => {
    return ok(res, await adminService.listProducts());
  }),
  productDetail: asyncHandler(async (req, res) => {
    return ok(res, await adminService.getProductDetail(req.validated.params.id));
  }),
  createProduct: asyncHandler(async (req, res) => {
    return ok(res, await adminService.createProduct(req.validated.body), '商品已新增');
  }),
  updateProduct: asyncHandler(async (req, res) => {
    return ok(
      res,
      await adminService.updateProduct(req.validated.params.id, req.validated.body),
      '商品信息已更新'
    );
  }),
  orders: asyncHandler(async (_req, res) => {
    return ok(res, await adminService.listOrders());
  }),
  orderDetail: asyncHandler(async (req, res) => {
    return ok(res, await adminService.getOrderDetail(req.validated.params.id));
  }),
  updateOrderStatus: asyncHandler(async (req, res) => {
    return ok(
      res,
      await adminService.updateOrderStatus(req.validated.params.id, req.validated.body.status),
      '订单状态已更新'
    );
  }),
  updateOrderLogistics: asyncHandler(async (req, res) => {
    return ok(
      res,
      await adminService.updateOrderLogistics(req.validated.params.id, req.validated.body),
      '物流信息已保存'
    );
  }),
  afterSales: asyncHandler(async (req, res) => {
    return ok(res, await adminService.listAfterSales(req.validated.query.orderId || ''));
  }),
  updateAfterSaleStatus: asyncHandler(async (req, res) => {
    return ok(
      res,
      await adminService.updateAfterSaleStatus(req.validated.params.id, req.validated.body.status),
      '售后状态已更新'
    );
  }),
  feedback: asyncHandler(async (_req, res) => {
    return ok(res, await adminService.listFeedback());
  }),
  updateFeedbackStatus: asyncHandler(async (req, res) => {
    return ok(
      res,
      await adminService.updateFeedbackStatus(req.validated.params.id, req.validated.body.status),
      '反馈状态已更新'
    );
  })
};
