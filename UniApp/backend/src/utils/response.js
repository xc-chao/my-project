// ==========================================
// 统一响应格式工具
// 功能：规范 API 返回的 JSON 格式
// ==========================================

const ErrorCodes = require('../constants/errorCodes');

/**
 * 成功响应
 * @param {Object} res - Express response 对象
 * @param {*} data - 返回的数据
 * @param {string} message - 成功消息
 * @returns {Object} JSON 响应
 */
const success = (res, data = null, message = '操作成功') => {
  return res.json({
    code: 200,
    message: message,
    data: data
  });
};

/**
 * 失败响应（根据错误码对象）
 * @param {Object} res - Express response 对象
 * @param {Object} errorCode - 错误码对象（从 errorCodes.js 导入）
 * @param {string} customMessage - 自定义错误消息（可选）
 * @returns {Object} JSON 响应
 */
const error = (res, errorCode = ErrorCodes.SERVER_ERROR, customMessage = null) => {
  const statusCode = errorCode.code >= 500 ? 500 : 
                     errorCode.code >= 400 ? errorCode.code : 400;
  
  return res.status(statusCode).json({
    code: errorCode.code,
    message: customMessage || errorCode.message,
    data: null
  });
};

/**
 * 自定义响应
 * @param {Object} res - Express response 对象
 * @param {number} code - 状态码
 * @param {string} message - 消息
 * @param {*} data - 数据
 * @returns {Object} JSON 响应
 */
const custom = (res, code, message, data = null) => {
  const statusCode = code >= 500 ? 500 : 
                     code >= 400 ? code : 200;
  
  return res.status(statusCode).json({
    code: code,
    message: message,
    data: data
  });
};

module.exports = {
  success,
  error,
  custom
};

