<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import ChatBubble from '../../components/common/ChatBubble.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import { createChatSession, getChatHistory, sendChatMessage } from '../../services/chatService';
import { useUserStore } from '../../store';

const userStore = useUserStore();
const mode = ref<'chat' | 'history'>('chat');
const sessionId = ref('');
const productId = ref('');
const productTitle = ref('当前商品');
const inputValue = ref('');
const sending = ref(false);
const messages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
const history = ref<Array<{ id: string; title: string; messages: Array<{ role: 'user' | 'assistant'; content: string }> }>>([]);

const quickQuestions = computed(() => [
  '这款商品怎么选尺码？',
  '这款适合日常通勤吗？',
  '多久可以发货？'
]);

async function ensureSession() {
  if (mode.value === 'history' || !productId.value || sessionId.value) {
    return;
  }

  const session = await createChatSession(productId.value);
  sessionId.value = session.id;
  messages.value = session.messages;
}

async function loadHistory() {
  history.value = await getChatHistory();
}

async function handleSend(question?: string) {
  const finalQuestion = (question || inputValue.value).trim();

  if (!finalQuestion || !sessionId.value) {
    return;
  }

  sending.value = true;

  try {
    const result = await sendChatMessage(sessionId.value, finalQuestion);
    messages.value = result.messages;
    inputValue.value = '';
  } finally {
    sending.value = false;
  }
}

onLoad(async (query) => {
  if (!userStore.isLoggedIn) {
    uni.redirectTo({
      url: '/pages/auth/login'
    });
    return;
  }

  if (query?.mode === 'history') {
    mode.value = 'history';
  }

  if (typeof query?.productId === 'string') {
    productId.value = query.productId;
  }

  if (typeof query?.title === 'string') {
    productTitle.value = decodeURIComponent(query.title);
  }

  if (mode.value === 'history') {
    await loadHistory();
    return;
  }

  await ensureSession();
});
</script>

<template>
  <view class="page-shell">
    <AppHeader title="Agent 智能助手" back />

    <view class="body">
      <view class="intro-card">
        <text class="intro-badge">{{ mode === 'history' ? '会话记录' : '商品上下文已接入' }}</text>
        <text class="intro-title">{{ productTitle }}</text>
        <text class="intro-text">
          {{ mode === 'history' ? '这里展示你最近的 AI 咨询会话摘要。' : '你可以直接提问尺码、材质、物流、售后政策，AI 会结合当前商品信息回答。' }}
        </text>
      </view>

      <scroll-view v-if="mode === 'chat'" scroll-x class="quick-scroll" show-scrollbar="false">
        <view class="quick-row">
          <view
            v-for="item in quickQuestions"
            :key="item"
            class="quick-pill"
            @tap="handleSend(item)"
          >
            <text>{{ item }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view v-if="mode === 'chat'" scroll-y class="msg-scroll">
        <view class="msg-list">
          <ChatBubble
            v-for="(item, index) in messages"
            :key="`${item.role}-${index}`"
            :role="item.role"
            :content="item.content"
          />
        </view>
      </scroll-view>

      <view v-else class="history-list">
        <view v-if="history.length" v-for="item in history" :key="item.id" class="history-card">
          <text class="history-title">{{ item.title }}</text>
          <text class="history-desc">{{ item.messages[item.messages.length - 1]?.content || '暂无消息' }}</text>
        </view>
        <EmptyStateCard
          v-else
          title="还没有 AI 咨询记录"
          desc="从首页或商品详情进入 AI 助手提问后，会在这里看到最近的会话摘要。"
        />
      </view>
    </view>

    <view v-if="mode === 'chat'" class="input-bar">
      <input
        v-model="inputValue"
        class="chat-input"
        placeholder="问问商品尺码、材质、物流"
        confirm-type="send"
        @confirm="handleSend()"
      />
      <view class="send-btn" @tap="handleSend()">
        <text>{{ sending ? '发送中' : '发送' }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.body {
  padding: 12rpx 40rpx 24rpx;
}

.intro-card {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding: 32rpx;
  border-radius: 48rpx;
  background: #ffffff;
}

.intro-badge {
  align-self: flex-start;
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #17181c;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
}

.intro-title {
  font-size: 32rpx;
  font-weight: 700;
}

.intro-text {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.quick-scroll {
  white-space: nowrap;
  margin-top: 20rpx;
}

.quick-row {
  display: inline-flex;
  gap: 16rpx;
}

.quick-pill {
  padding: 18rpx 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  font-size: 24rpx;
  color: #111111;
}

.msg-scroll {
  height: calc(100vh - 520rpx);
  margin-top: 20rpx;
}

.msg-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding-bottom: 24rpx;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  margin-top: 20rpx;
}

.history-card {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 28rpx;
  border-radius: 36rpx;
  background: #ffffff;
}

.history-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #111111;
}

.history-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: #6e7380;
}

.input-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 40rpx 32rpx;
}

.chat-input {
  flex: 1;
  height: 96rpx;
  padding: 0 28rpx;
  border-radius: 48rpx;
  background: #ffffff;
  font-size: 26rpx;
}

.send-btn {
  min-width: 140rpx;
  height: 96rpx;
  padding: 0 24rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #17181c;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 700;
}
</style>
