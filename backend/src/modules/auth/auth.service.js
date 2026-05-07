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

function buildWechatPhone(openid) {
  return `wx_${openid.slice(0, 28)}`;
}

function buildUserDataFromWechat(user, openid, role) {
  return {
    openid,
    nickname: user.nickname,
    avatar: user.avatar,
    phone: buildWechatPhone(openid),
    role
  };
}

async function fetchWechatSession(code) {
  if (!env.wechatAppId || !env.wechatAppSecret) {
    throw new AppError(500, 'WECHAT_CONFIG_MISSING', '微信登录配置未完成');
  }

  const url = new URL('https://api.weixin.qq.com/sns/jscode2session');
  url.searchParams.set('appid', env.wechatAppId);
  url.searchParams.set('secret', env.wechatAppSecret);
  url.searchParams.set('js_code', code);
  url.searchParams.set('grant_type', 'authorization_code');

  const response = await fetch(url, {
    method: 'GET'
  });
  const data = await response.json();

  if (!response.ok || data.errcode) {
    throw new AppError(502, 'WECHAT_LOGIN_FAILED', data.errmsg || '微信登录失败');
  }

  return data;
}

export const authService = {
  async loginForDevelopment(payload) {
    if (env.nodeEnv !== 'development') {
      throw new AppError(403, 'DEV_LOGIN_DISABLED', '开发登录仅允许在开发环境使用');
    }

    const user = await authRepository.findByRole(payload.role || 'user');

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', '未找到可用的测试账号');
    }

    return buildSessionPayload(user);
  },
  async loginWithWechat(payload) {
    const session = await fetchWechatSession(payload.code);
    const isAdmin = env.wechatAdminOpenids.includes(session.openid);
    const role = isAdmin ? 'admin' : 'user';
    let user = await authRepository.findByOpenid(session.openid);

    if (user) {
      if (user.role !== role) {
        user = await authRepository.updateById(user.id, buildUserDataFromWechat(user, session.openid, role));
      }

      return buildSessionPayload(user);
    }

    user = await authRepository.findOrCreateByOpenid({
      openid: session.openid,
      role
    });

    if (!user) {
      throw new AppError(500, 'USER_CREATE_FAILED', '登录用户创建失败');
    }

    return buildSessionPayload(user);
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
      openid: targetUser.openid || '',
      nickname: payload.nickname || targetUser.nickname,
      avatar: payload.avatar || targetUser.avatar,
      phone: targetUser.phone || buildWechatPhone(targetUser.openid || ''),
      role: targetRole
    });

    return buildSessionPayload(updated || targetUser);
  }
};
