import { ok } from '../../common/utils/response.js';
import { authService } from './auth.service.js';

export const authController = {
  wechatLogin(req, res) {
    const result = authService.loginWithWechat(req.validated.body);
    req.session.userId = result.user.id;
    return ok(res, result, '登录成功');
  },
  smsCode(req, res) {
    const result = authService.sendSmsCode(req.validated.body.phone);
    return ok(res, result, '验证码已发送');
  },
  smsLogin(req, res) {
    const result = authService.loginWithSms(req.validated.body);
    req.session.userId = result.user.id;
    return ok(res, result, '登录成功');
  },
  logout(req, res) {
    req.session.destroy(() => {
      ok(res, {}, '已退出登录');
    });
  },
  profile(req, res) {
    const result = authService.getProfile(req.user);
    return ok(res, result);
  }
};
