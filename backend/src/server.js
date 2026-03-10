import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './common/logger/logger.js';

const app = createApp();

app.listen(env.port, () => {
  logger.info(`backend listening on http://localhost:${env.port}`);
});
