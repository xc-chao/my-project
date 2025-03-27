import axios from '@/utils/axios'

// 获取账单列表
export const getBillList = async () => await axios.get('/bill')

// 获取账单详情
export const getBillDetail = async (id) => await axios.get(`/bill/${id}`)

// 添加账单
export const addBill = async (data) => await axios.post('/bill', data)

// 更新账单
export const updateBill = async (id, data) => await axios.patch(`/bill/${id}`, data)

// 删除账单
export const deleteBill = async (id) => await axios.delete(`/bill/${id}`)