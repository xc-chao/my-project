import { mockDb } from '../../data/mockDb.js';

export const authRepository = {
  findDefaultUser() {
    return mockDb.users[0];
  }
};
