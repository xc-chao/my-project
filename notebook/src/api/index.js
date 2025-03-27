import axios from '@/utils/axios'

// 所有的请求
// 后端提供接口
export const login = async (username, password) => 
  await axios.post('/login', {
    username,
    password
  })

export const register = async (username, password) => 
  await axios.post('/register', {
    username,
    password
  })

export const uploadAvatar = async () => await axios.post('/upload')
export const getUserInfo = async () => await axios.get('/user/getUserInfo')
export const updateSignature = async (signature) => await axios.patch('/user/signature', {
  signature
})

export const getBillDetail = async (id) => await axios.get(`/bill/${id}`)
