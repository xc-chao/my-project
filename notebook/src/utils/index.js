// 项目中的接口统一管理
import axios from './axios'

export const get = axios.get
export const post = axios.post

export const getUserInfo = async () => {
  return await get('/user/getUserInfo')
}

export const typeMap = {
  1: {
    icon: 'canyin',
    type_name: '餐饮'
  },
  2: {
    icon: 'fushi',
    type_name: '服饰'
  },
  3: {
    icon: 'jiaotong',
    type_name: '交通'
  },
  4: {
    icon: 'riyong',
    type_name: '日用'
  },
  5: {
    icon: 'gouwu',
    type_name: '购物'
  },
  6: {
    icon: 'xuexi',
    type_name: '学习'
  },
  7: {
    icon: 'yiliao',
    type_name: '医疗'
  },
  8: {
    icon: 'lvxing',
    type_name: '旅行'
  },
  9: {
    icon: 'songli',
    type_name: '送礼'
  },
  10: {
    icon: 'qita',
    type_name: '其他'
  },
  11: {
    icon: 'gongzi',
    type_name: '工资'
  },
  12: {
    icon: 'jiangjin',
    type_name: '奖金'
  },
  13: {
    icon: 'zhuanzhang',
    type_name: '转账'
  },
  14: {
    icon: 'licai',
    type_name: '理财'
  },
  15: {
    icon: 'tuikuang',
    type_name: '退款'
  },
  16: {
    icon: 'qita',
    type_name: '其他'
  },
}