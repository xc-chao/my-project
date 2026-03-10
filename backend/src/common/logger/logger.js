export const logger = {
  info(message, meta) {
    console.log(`[info] ${message}`, meta || '');
  },
  warn(message, meta) {
    console.warn(`[warn] ${message}`, meta || '');
  },
  error(message, meta) {
    console.error(`[error] ${message}`, meta || '');
  }
};
