<template>
    <div
        class="chatPage container h-[calc(100vh-3rem)] relative bg-gradient-to-r from-blue-400 to-blue-200"
    >
        <!-- 顶部 -->
        <div
        class="chat-header h-[calc(10vh)] w-full flex items-center justify-between bg-transparent px-4 border-b border-white rounded-xl"
        >
        <div class="talk">
            <van-icon name="chat-o text-black" size="1.5rem" />
        </div>
        <div class="title">
            <h2>AI 奇趣购助手</h2>
        </div>
        <div class="avatar">
            <van-icon name="user-o text-black" size="1.5rem" />
        </div>
        </div>
        <!-- 聊天记录 -->
        <div class="response-container p-4 overflow-y-auto h-[calc(80vh)]">
          <div v-for="(msg, index) in messages" :key="index" class="message-container mb-2">
            <div v-if="msg.type === 'user'" class="user-message p-1 max-w-xs ml-auto">
              <UserAsk :msg="msg.content" />
            </div>
            <div v-if="msg.type === 'ai'" class="ai-message text-gray-800 p-1 max-w-full ml-0">
              <AIReply :msg="msg.content" />
            </div>
          </div>
        </div>
        <!-- 输入框 -->
        <div
        class="chat_footer h-16 w-full bottom-0 absolute z-999 border-t border-white rounded-xl"
        >
        <van-search
            v-model="query"
            placeholder="请输入..."
            show-action
            shape="round"
            background="transparent"    
            class="mt-0.5"
            @search="handleSearch"
        >
          <template #action>
            <div class="text-blue-600 flex items-center" @click="handleSearch">
              <van-icon name="guide-o" size="1.5rem" />
            </div>
          </template>
        </van-search>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import AIReply from '../AI/AIReply.vue'; // Import the AIReply component
  import UserAsk from '../AI/UserAsk.vue'; // Import the UserAsk component
  
  const query = ref('');
  const messages = ref<{ type: string; content: string }[]>([]); // 存储消息
  
  // Welcome message
  onMounted(() => {
    messages.value.push({
      type: 'ai',
      content: "✨ 欢迎使用AI购物助手！我是小购 🤖，为您提供贴心购物引导、最新资讯及专属优惠。无论日常用品或特别礼物，助您购物满载而归 🛒🚀"
    });
  });
  
  const handleSearch = async () => {
    if (!query.value.trim()) {
      return; // 如果输入为空，直接返回
    }
  
    // 添加用户消息
    messages.value.push({ type: 'user', content: query.value });
  
    try {
      // 发送加载消息
      messages.value.push({ type: 'ai', content: '✨✨✨\n收到！ 我已经了解到您的需求，请稍等片刻！！！🌟' });

      const res = await axios.post('http://localhost:3000/chatai', {
        message: query.value // 确保消息被包装在对象中
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // 添加 AI 消息
      messages.value.push({ type: 'ai', content: res.data.message }); // 假设后端返回的结构是 { message: '...' }
    } catch (error) {
      console.error('请求失败:', error);
      messages.value.push({ type: 'ai', content: '请求失败，请稍后再试。' }); // 显示错误信息
    } finally {
      query.value = ''; // 清空输入框
    }
  };
  </script>
  
  <style scoped>
  .assistant-container {
    background-color: #f0f4ff; /* 轻微的背景色 */
  }
  
  .response-container {
    border-radius: 12px; /* 圆角 */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  }
  
  .message-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 默认对齐左边 */
  }
  
  .user-message {
    align-self: flex-end; /* 用户消息右对齐 */
  }
  
  .ai-message {
    align-self: flex-start; /* AI 消息左对齐 */
  }
  
  .input-container {
    position: relative; /* 确保输入框在底部 */
    z-index: 10; /* 确保输入框在其他元素之上 */
    margin-bottom: 12px; /* 避免与底部 TabBar 重叠 */
  }
  
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  </style>