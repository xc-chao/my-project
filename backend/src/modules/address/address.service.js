import { AppError } from '../../common/errors/AppError.js';
import { mockDb } from '../../data/mockDb.js';

export const addressService = {
  list(userId) {
    return mockDb.addresses.filter((item) => item.userId === userId);
  },
  create(userId, payload) {
    if (payload.isDefault) {
      this.list(userId).forEach((item) => {
        item.isDefault = false;
      });
    }

    const created = {
      id: `addr_${Date.now()}`,
      userId,
      name: payload.name,
      phone: payload.phone,
      region: payload.region,
      detail: payload.detail,
      isDefault: Boolean(payload.isDefault)
    };

    mockDb.addresses.unshift(created);
    return this.list(userId);
  },
  update(userId, id, payload) {
    const target = mockDb.addresses.find((item) => item.id === id && item.userId === userId);

    if (!target) {
      throw new AppError(404, 'ADDRESS_NOT_FOUND', '地址不存在');
    }

    if (payload.isDefault) {
      this.list(userId).forEach((item) => {
        item.isDefault = false;
      });
    }

    target.name = payload.name;
    target.phone = payload.phone;
    target.region = payload.region;
    target.detail = payload.detail;
    target.isDefault = Boolean(payload.isDefault);

    return this.list(userId);
  },
  remove(userId, id) {
    const index = mockDb.addresses.findIndex((item) => item.id === id && item.userId === userId);

    if (index === -1) {
      throw new AppError(404, 'ADDRESS_NOT_FOUND', '地址不存在');
    }

    mockDb.addresses.splice(index, 1);
    return this.list(userId);
  }
};
