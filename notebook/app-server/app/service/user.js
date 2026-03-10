'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  generateToken(user) {
    const { app } = this;
    const token = app.jwt.sign({
      id: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24小时过期
    }, app.config.jwt.secret);
    
    const refreshToken = app.jwt.sign({
      id: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7天过期
    }, app.config.jwt.refreshSecret);

    return { token, refreshToken };
  }

  verifyRefreshToken(refreshToken) {
    const { app } = this;
    try {
      const decoded = app.jwt.verify(refreshToken, app.config.jwt.refreshSecret);
      return decoded;
    } catch (err) {
      return null;
    }
  }
  async getUserByName(username) {
    const { ctx } = this
    try {
      const result = await ctx.model.User.findOne({
        where: {
          username
        }
      })
      return result
    } catch(err) {
      console.log(err)
      return null
    }
  }

  async register(user) {
    const { ctx } = this
    try {
      // orm 
      // sequelize
      const result = await ctx.model.User.create(user)
      return result
    } catch(err) {
      console.log(err);
      return null;
    }
  }

  async editUserInfo(username, signature) {
    const { ctx } = this
    try {
      const user = await this.getUserByName(username);
      if (!user) {
        return {
          code: 404,
          msg: '用户不存在',
          data: null
        };
      }
      const result = await user.update({
        signature: signature
      });
      return {
        code: 200,
        msg: '修改成功',
        data: result
      };
    } catch(err) {
      console.log(err);
      return {
        code: 500,
        msg: '修改失败',
        data: null
      };
    }
  }
}

module.exports = UserService;