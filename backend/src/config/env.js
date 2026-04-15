import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret',
  aiProvider: process.env.AI_PROVIDER || 'deepseek',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
  arkApiKey: process.env.ARK_API_KEY || '',
  arkBaseUrl: process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3',
  arkModel: process.env.ARK_MODEL || 'deepseek-v3-2-251201',
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: Number(process.env.DB_PORT || 3306),
  dbName: process.env.DB_NAME || 'uniapp_pencil',
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbConnectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10)
};
