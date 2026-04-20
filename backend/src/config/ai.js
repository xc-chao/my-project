import { env } from './env.js';

export const aiConfig = {
  provider: env.aiProvider,
  timeoutMs: 30000,
  retryTimes: 1
};
