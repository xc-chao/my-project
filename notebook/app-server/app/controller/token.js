'use strict';

const Controller = require('egg').Controller;

class TokenController extends Controller {
  async refresh() {
    const { ctx } = this;
    const { refreshToken } = ctx.request.body;

    if (!refreshToken) {
      ctx.body = {
        code: 400,
        msg: 'Refresh token is required',
        data: null
      };
      return;
    }

    // 验证refreshToken
    const decoded = await ctx.service.user.verifyRefreshToken(refreshToken);
    if (!decoded) {
      ctx.body = {
        code: 401,
        msg: 'Invalid refresh token',
        data: null
      };
      return;
    }

    // 获取用户信息
    const userInfo = await ctx.service.user.getUserByName(decoded.username);
    if (!userInfo) {
      ctx.body = {
        code: 404,
        msg: 'User not found',
        data: null
      };
      return;
    }

    // 生成新的token对
    const tokens = await ctx.service.user.generateToken(userInfo);

    ctx.body = {
      code: 200,
      msg: 'Token refreshed successfully',
      data: tokens
    };
  }
}

module.exports = TokenController;