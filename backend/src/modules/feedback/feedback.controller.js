import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ok } from '../../common/utils/response.js';
import { feedbackService } from './feedback.service.js';

export const feedbackController = {
  list: asyncHandler(async (req, res) => {
    const productId = req.query.productId;
    return ok(res, await feedbackService.listByProductId(productId || ''));
  }),
  create: asyncHandler(async (req, res) => {
    return ok(res, await feedbackService.create(req.user.userId, req.validated.body));
  })
};
