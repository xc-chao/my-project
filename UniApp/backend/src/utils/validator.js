// ==========================================
// 数据验证工具
// 功能：验证用户输入的数据格式
// ==========================================

/**
 * 验证手机号格式（中国大陆手机号）
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {boolean} 是否有效
 */
const isValidPassword = (password) => {
  // 至少 6 位
  return password && password.length >= 6;
};

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱
 * @returns {boolean} 是否有效
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证条形码格式（EAN-13）
 * @param {string} barcode - 条形码
 * @returns {boolean} 是否有效
 */
const isValidBarcode = (barcode) => {
  const barcodeRegex = /^\d{13}$/;
  return barcodeRegex.test(barcode);
};

/**
 * 验证必填字段
 * @param {Object} data - 数据对象
 * @param {Array} requiredFields - 必填字段数组
 * @returns {Object} { valid: boolean, missingFields: [] }
 */
const validateRequired = (data, requiredFields) => {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '') {
      missingFields.push(field);
    }
  });
  
  return {
    valid: missingFields.length === 0,
    missingFields
  };
};

module.exports = {
  isValidPhone,
  isValidPassword,
  isValidEmail,
  isValidBarcode,
  validateRequired
};

