export const env = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret',
  aiProvider: process.env.AI_PROVIDER || 'deepseek'
};
