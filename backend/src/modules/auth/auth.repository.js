import { mockDb } from '../../data/mockDb.js';

export const authRepository = {
  findDefaultUser() {
    return mockDb.users[0];
  },
  findByRole(role = 'user') {
    return mockDb.users.find((item) => item.role === role) || mockDb.users[0];
  },
  findById(id) {
    return mockDb.users.find((item) => item.id === id);
  }
};
