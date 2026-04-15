import { ok } from '../../common/utils/response.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { afterSaleService } from './afterSale.service.js';

export const afterSaleController = {
  list: asyncHandler(async (req, res) => {
    return ok(res, await afterSaleService.list(req.user.userId));
  }),
  create: asyncHandler(async (req, res) => {
    return ok(res, await afterSaleService.create(req.user.userId, req.validated.body), '售后申请已提交');
  })
};
