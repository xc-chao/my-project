import { ok } from '../../common/utils/response.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { addressService } from './address.service.js';

export const addressController = {
  list: asyncHandler(async (req, res) => {
    return ok(res, await addressService.list(req.user.userId));
  }),
  create: asyncHandler(async (req, res) => {
    return ok(res, await addressService.create(req.user.userId, req.validated.body), '地址已新增');
  }),
  update: asyncHandler(async (req, res) => {
    return ok(res, await addressService.update(req.user.userId, req.validated.params.id, req.validated.body), '地址已更新');
  }),
  remove: asyncHandler(async (req, res) => {
    return ok(res, await addressService.remove(req.user.userId, req.validated.params.id), '地址已删除');
  })
};
