import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useMyStore = defineStore('my', () => {
    // 我的头像
    const userInfo = ref({
        username: '千里寻找马甲线',
        greeting: '你好，欢迎来到奇趣商城',
        avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.UyaBji0AU_6M3VDA2F1RvgAAAA?rs=1&pid=ImgDetMain',
    })
   return {
    userInfo
   }
})