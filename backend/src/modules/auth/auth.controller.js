import { ok } from '../../common/utils/response.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { authService } from './auth.service.js';

export const authController = {
  wechatLogin: asyncHandler(async (req, res) => {
    const result = await authService.loginWithWechat(req.validated.body);
    req.session.userId = result.user.id;
    return ok(res, result, '登录成功');
  }),
  smsCode: asyncHandler(async (req, res) => {
    const result = await authService.sendSmsCode(req.validated.body.phone);
    return ok(res, result, '验证码已发送');
  }),
  smsLogin: asyncHandler(async (req, res) => {
    const result = await authService.loginWithSms(req.validated.body);
    req.session.userId = result.user.id;
    return ok(res, result, '登录成功');
  }),
  logout(req, res) {
    req.session.destroy(() => {
      ok(res, {}, '已退出登录');
    });
  },
  profile: asyncHandler(async (req, res) => {
    const result = await authService.getProfile(req.user);
    return ok(res, result);
  }),
  updateProfile: asyncHandler(async (req, res) => {
    const result = await authService.updateProfile(req.user, req.validated.body);
    req.session.userId = result.user.id;
    return ok(res, result, '资料已更新');
  })
};
