import { ok } from '../../common/utils/response.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { chatService } from './chat.service.js';

export const chatController = {
  createSession: asyncHandler(async (req, res) => {
    return ok(res, await chatService.createSession(req.user.userId, req.validated.body.productId), '会话已创建');
  }),
  sendMessage: asyncHandler(async (req, res) => {
    return ok(res, await chatService.sendMessage(req.user.userId, req.validated.body), '消息已发送');
  }),
  history: asyncHandler(async (req, res) => {
    return ok(res, await chatService.getHistory(req.user.userId));
  })
};
