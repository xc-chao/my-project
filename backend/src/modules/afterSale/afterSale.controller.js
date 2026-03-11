import { ok } from '../../common/utils/response.js';
import { afterSaleService } from './afterSale.service.js';

export const afterSaleController = {
  list(req, res) {
    return ok(res, afterSaleService.list(req.user.userId));
  },
  create(req, res) {
    return ok(res, afterSaleService.create(req.user.userId, req.body), '售后申请已提交');
  }
};
