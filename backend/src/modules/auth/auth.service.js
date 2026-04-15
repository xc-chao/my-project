import jwt from 'jsonwebtoken';
import { AppError } from '../../common/errors/AppError.js';
import { env } from '../../config/env.js';
import { authRepository } from './auth.repository.js';

function buildToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      nickname: user.nickname
    },
    env.jwtSecret,
    {
      expiresIn: '7d'
    }
  );
}

function buildSessionPayload(user) {
  return {
    user,
    accessToken: buildToken(user),
    session: {
      expiresIn: '7d'
    }
  };
}

export const authService = {
  async loginWithWechat(payload) {
    const user = await authRepository.findByRole(payload.identity || 'user');

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', '未找到可用的演示账号');
    }

    const profile = {
      ...user,
      nickname: payload.nickname || user.nickname
    };

    if (payload.nickname && payload.nickname !== user.nickname) {
      await authRepository.updateById(user.id, {
        nickname: payload.nickname
      });
    }

    return buildSessionPayload(profile);
  },
  async sendSmsCode(phone) {
    return {
      phone,
      codeSent: true
    };
  },
  async loginWithSms(payload) {
    const user =
      (await authRepository.findByPhone(payload.phone)) ||
      (await authRepository.findByRole(payload.identity || 'user'));

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', '未找到可用的演示账号');
    }

    return buildSessionPayload(user);
  },
  async getProfile(userPayload) {
    const user =
      (await authRepository.findById(userPayload.userId)) ||
      (await authRepository.findByRole(userPayload.role)) ||
      (await authRepository.findDefaultUser());

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', '用户不存在');
    }

    return user;
  },
  async updateProfile(userPayload, payload) {
    const currentUser = await this.getProfile(userPayload);
    const targetRole = payload.role || currentUser.role;
    const targetUser =
      (targetRole === currentUser.role
        ? currentUser
        : await authRepository.findByRole(targetRole)) || currentUser;
    const updated = await authRepository.updateById(targetUser.id, {
      nickname: payload.nickname || targetUser.nickname,
      avatar: payload.avatar || targetUser.avatar,
      role: targetRole
    });

    return buildSessionPayload(updated || targetUser);
  }
};
