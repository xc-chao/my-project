'use strict';

const Controller = require('egg').Controller;
const bcrypt = require('bcryptjs') // 单向加密

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'
// java 风格
class UserController extends Controller {
  // 注册
  async register() {
    // 解析请求体 username password
    const { ctx } = this;
    // 解构请求体
    const { username, password } = ctx.request.body;
    // 校验参数
    if (!username || !password) {
      ctx.body  = {
        code: 400,
        msg: '用户名或密码不能为空',
      }
      return 
    }

    // username 是否存在
    const userInfo = await ctx.service.user.getUserByName(username)
    console.log(userInfo, '////////');
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 400,
        msg: '账户已经被注册,请重新输入',
        data: null
      }
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    const result = await ctx.service.user.register({
      username,
      password: hashedPassword,
      avatar: defaultAvatar,
      ctime:  +Date.now(),
      signature: '这个人很懒,什么都没有留下',
    })

    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null
      }
    }

  }

  async login() {
    // 参数
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    console.log(username, password, '---------------');
    if (!username || !password) {
      ctx.body = {
        code: 400,
        msg: '用户名或密码不能为空',
        data: null
      }
      return;
    }

    const userInfo = await ctx.service.user.getUserByName(username)
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '用户名不存在',
        data: null
      }
      return
    }

    const isPasswordValid = await bcrypt.compare(password, userInfo.password)

    if (userInfo && !isPasswordValid) {
      ctx.body = {
        code: 500,
        msg: '密码错误',
        data: null
      }
      return 
    }


    // 生成双token
    const { token, refreshToken } = await ctx.service.user.generateToken(userInfo);

    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        token,
        refreshToken
      }
    }
  }
  
  async editSignature() {
    const { ctx } = this;
    console.log(ctx.user, '?????/')
    if  (!ctx.user) {
      ctx.body = {
        code: 401,
        msg: '请先登录',
        data: null
      }
      return;
    }

    const { signature } = ctx.request.body;
    if (!signature) {
      ctx.body = {
        code: 400,
        msg: '签名不能为空',
        data: null
      }
      return;
    }
    try {
      const result = await ctx.service.user.editUserInfo(
        ctx.user.username, 
        signature
      )
      ctx.body = {
        code: 200,
        msg: '修改成功',
        data: result
      }
    }catch(err) {
      ctx.body = {
        code: 500,
        msg: '修改失败',
        data: null
      }
    }
    
  }

  async getUserInfo() {
    const { ctx } = this;
    if (!ctx.user) {
      ctx.body = {
        code: 401,
        msg: '请先登录',
        data: null
      }
      return;
    }
    try {
      const result = await ctx.service.user.getUserByName(ctx.user.username)
      ctx.body = {
        code: 200,
        msg: '获取成功',
        data: result
      }
    } catch(err) {
      ctx.body = {
        code: 500,
        msg: '获取失败',
        data: null
      }
    }
    
  }

}

module.exports = UserController;