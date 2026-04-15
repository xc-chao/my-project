import { AppError } from '../../common/errors/AppError.js';
import { addressRepository } from './address.repository.js';

export const addressService = {
  async list(userId) {
    return addressRepository.listByUserId(userId);
  },
  async create(userId, payload) {
    return addressRepository.create(userId, payload);
  },
  async update(userId, id, payload) {
    const result = await addressRepository.update(userId, id, payload);

    if (!result) {
      throw new AppError(404, 'ADDRESS_NOT_FOUND', '地址不存在');
    }

    return result;
  },
  async remove(userId, id) {
    const result = await addressRepository.remove(userId, id);

    if (!result) {
      throw new AppError(404, 'ADDRESS_NOT_FOUND', '地址不存在');
    }

    return result;
  }
};
