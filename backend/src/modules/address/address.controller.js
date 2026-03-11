import { ok } from '../../common/utils/response.js';
import { addressService } from './address.service.js';

export const addressController = {
  list(req, res) {
    return ok(res, addressService.list(req.user.userId));
  },
  create(req, res) {
    return ok(res, addressService.create(req.user.userId, req.body), '地址已新增');
  },
  update(req, res) {
    return ok(res, addressService.update(req.user.userId, req.params.id, req.body), '地址已更新');
  },
  remove(req, res) {
    return ok(res, addressService.remove(req.user.userId, req.params.id), '地址已删除');
  }
};
