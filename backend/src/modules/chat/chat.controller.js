import { ok } from '../../common/utils/response.js';
import { chatService } from './chat.service.js';

export const chatController = {
  createSession(req, res) {
    return ok(res, chatService.createSession(req.user.userId, req.validated.body.productId), '会话已创建');
  },
  async sendMessage(req, res) {
    return ok(res, await chatService.sendMessage(req.user.userId, req.validated.body), '消息已发送');
  },
  history(req, res) {
    return ok(res, chatService.getHistory(req.user.userId));
  }
};
