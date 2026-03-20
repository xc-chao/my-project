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
    const user = authRepository.findByRole(payload.identity || 'user');
    const profile = {
      ...user,
      nickname: payload.nickname || user.nickname
    };

    return {
      user: profile,
      accessToken: buildToken(profile),
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
  loginWithSms(payload) {
    const user = authRepository.findByRole(payload.identity || 'user');

    return {
      user,
      accessToken: buildToken(user),
      session: {
        expiresIn: '7d'
      }
    };
  },
  getProfile(userPayload) {
    const user =
      authRepository.findById(userPayload.userId) ||
      authRepository.findByRole(userPayload.role) ||
      authRepository.findDefaultUser();

    return user;
  }
};
