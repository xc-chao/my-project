import jwt from 'jsonwebtoken';
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

export const authService = {
  loginWithWechat(payload) {
    const user = authRepository.findDefaultUser();

    return {
      user: {
        ...user,
        nickname: payload.nickname || user.nickname
      },
      accessToken: buildToken(user),
      session: {
        expiresIn: '7d'
      }
    };
  },
  sendSmsCode(phone) {
    return {
      phone,
      codeSent: true
    };
  },
  loginWithSms() {
    const user = authRepository.findDefaultUser();

    return {
      user,
      accessToken: buildToken(user),
      session: {
        expiresIn: '7d'
      }
    };
  },
  getProfile(userPayload) {
    const user = authRepository.findDefaultUser();

    return {
      ...user,
      id: userPayload.userId
    };
  }
};
