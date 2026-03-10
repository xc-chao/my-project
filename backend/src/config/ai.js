import { env } from './env.js';

export const aiConfig = {
  provider: env.aiProvider,
  timeoutMs: 8000,
  retryTimes: 1
};
