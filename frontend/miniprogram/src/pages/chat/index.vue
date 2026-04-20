<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import AppHeader from '../../components/AppHeader.vue';
import ChatBubble from '../../components/common/ChatBubble.vue';
import EmptyStateCard from '../../components/common/EmptyStateCard.vue';
import { pageImageMap } from '../../constants/page-image-map';
import { createChatSession, getChatHistory, sendChatMessage, type ChatSession } from '../../services/chatService';
import { useUserStore } from '../../store';

type ChatPageMode = 'chat' | 'history';

interface ChatPageQuery {
  mode: ChatPageMode;
  productId: string;
  title: string;
}

const userStore = useUserStore();
const mode = ref<ChatPageMode>('chat');
const sessionId = ref('');
const productId = ref('');
const productTitle = ref('当前商品');
const inputValue = ref('');
const sending = ref(false);
const messages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
const history = ref<ChatSession[]>([]);
const routeKey = ref('');
const initialized = ref(false);
let initTaskId = 0;

const quickQuestions = computed(() =>
  productId.value
    ? ['这款商品怎么选尺码？', '这款适合日常通勤吗？', '多久可以发货？']
    : ['有什么值得买的推荐吗？', '怎么选合适的尺码？', '退换货政策是什么？']
);
function getHistoryThumb(session: ChatSession) {
  return session.productCover || pageImageMap.chat.historyThumb;
}

function decodeTitle(title: unknown) {
  if (typeof title !== 'string' || !title) {
    return '';
  }

  try {
    return decodeURIComponent(title);
  } catch (_error) {
    return title;
  }
}

function normalizeQuery(query?: Record<string, any>): ChatPageQuery {
  const nextMode: ChatPageMode = query?.mode === 'history' ? 'history' : 'chat';
  const nextProductId = typeof query?.productId === 'string' ? query.productId : '';
  const nextTitle = decodeTitle(query?.title) || (nextMode === 'history' ? '咨询记录' : (nextProductId ? '当前商品' : 'AI 购物助手'));

  return {
    mode: nextMode,
    productId: nextProductId,
    title: nextTitle
  };
}

function buildRouteKey(query: ChatPageQuery) {
  return `${query.mode}|${query.productId}|${query.title}`;
}

function resetPageState(query: ChatPageQuery) {
  mode.value = query.mode;
  sessionId.value = '';
  productId.value = query.productId;
  productTitle.value = query.title;
  inputValue.value = '';
  sending.value = false;
  messages.value = [];
  history.value = [];
}

function getCurrentPageQuery() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as { options?: Record<string, any> } | undefined;
  return currentPage?.options || {};
}

function getH5Query() {
  if (typeof window === 'undefined') {
    return getCurrentPageQuery();
  }

  const hash = window.location.hash || '';
  const [, search = ''] = hash.split('?');
  return Object.fromEntries(new URLSearchParams(search).entries());
}

async function ensureSession(taskId: number) {
  if (mode.value === 'history' || sessionId.value) {
    return;
  }

  const session = await createChatSession(productId.value || undefined);

  if (taskId !== initTaskId) {
    return;
  }

  sessionId.value = session.id;
  messages.value = session.messages;
}

async function loadHistory(taskId: number) {
  const nextHistory = await getChatHistory();

  if (taskId !== initTaskId) {
    return;
  }

  history.value = nextHistory;
}

async function initializePage(
  rawQuery?: Record<string, any>,
  options: {
    refreshHistory?: boolean;
  } = {}
) {
  if (!userStore.isLoggedIn) {
    uni.redirectTo({
      url: '/pages/auth/login'
    });
    return;
  }

  const nextQuery = normalizeQuery(rawQuery);
  const nextKey = buildRouteKey(nextQuery);
  const sameRoute = routeKey.value === nextKey;

  if (!sameRoute) {
    resetPageState(nextQuery);
    routeKey.value = nextKey;
  }

  const taskId = ++initTaskId;

  if (nextQuery.mode === 'history') {
    if (!sameRoute || options.refreshHistory) {
      await loadHistory(taskId);
    }

    initialized.value = true;
    return;
  }

  if (!sameRoute) {
    productTitle.value = nextQuery.title;
    productId.value = nextQuery.productId;
  }

  if (sameRoute && sessionId.value) {
    initialized.value = true;
    return;
  }

  await ensureSession(taskId);
  initialized.value = true;
}

const aiLoading = ref(false);

async function handleSend(question?: string) {
  const finalQuestion = (question || inputValue.value).trim();

  if (!finalQuestion || !sessionId.value) {
    return;
  }

  sending.value = true;
  inputValue.value = '';

  // 立即展示用户消息 + AI 加载占位
  messages.value.push({ role: 'user', content: finalQuestion });
  aiLoading.value = true;

  try {
    const result = await sendChatMessage(sessionId.value, finalQuestion);
    aiLoading.value = false;
    messages.value = result.messages;
  } catch {
    aiLoading.value = false;
    // 请求失败时移除用户刚发的消息，恢复输入
    messages.value.pop();
    inputValue.value = finalQuestion;
  } finally {
    sending.value = false;
  }
}

onLoad(async (query) => {
  await initializePage(query);
});

onShow(() => {
  if (!initialized.value) {
    return;
  }

  void initializePage(getCurrentPageQuery(), {
    refreshHistory: true
  });
});

function handleH5HashChange() {
  if (typeof window === 'undefined' || !window.location.hash.includes('/pages/chat/index')) {
    return;
  }

  void initializePage(getH5Query(), {
    refreshHistory: true
  });
}

onMounted(() => {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('hashchange', handleH5HashChange);
});

onUnmounted(() => {
  if (typeof window === 'undefined') {
    return;
  }

  window.removeEventListener('hashchange', handleH5HashChange);
});
</script>

<template>
  <view class="page-shell">
    <AppHeader title="Agent 智能助手" back />

    <view class="body">
      <view class="intro-card">
        <view class="intro-top">
          <view class="intro-copy">
            <text class="intro-badge">{{ mode === 'history' ? '会话记录' : (productId ? '商品上下文已接入' : 'AI 购物助手') }}</text>
            <text class="intro-title">{{ productTitle }}</text>
            <text class="intro-text">
              {{ mode === 'history' ? '这里展示你最近的 AI 咨询会话摘要。' : (productId ? '你可以直接提问尺码、材质、物流、售后政策，AI 会结合当前商品信息回答。' : '你可以问我任何购物相关的问题，比如选购建议、尺码推荐、物流售后等。') }}
            </text>
          </view>
        </view>
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
          <ChatBubble
            v-if="aiLoading"
            role="assistant"
            content=""
            :loading="true"
          />
        </view>
      </scroll-view>

      <view v-else class="history-list">
        <view v-if="history.length" v-for="item in history" :key="item.id" class="history-card">
          <image class="history-thumb" :src="getHistoryThumb(item)" mode="aspectFill" />
          <view class="history-copy">
            <text class="history-title">{{ item.title }}</text>
            <text class="history-desc">{{ item.messages[item.messages.length - 1]?.content || '暂无消息' }}</text>
          </view>
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

.intro-top {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.intro-copy {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
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

.intro-visual {
  display: flex;
  gap: 16rpx;
  height: 220rpx;
}

.intro-main,
.intro-accent {
  border-radius: 28rpx;
  background: #eef0f4;
}

.intro-main {
  flex: 1;
}

.intro-accent {
  width: 180rpx;
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
  height: calc(100vh - 750rpx);
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
  gap: 18rpx;
  padding: 28rpx;
  border-radius: 36rpx;
  background: #ffffff;
}

.history-thumb {
  width: 132rpx;
  height: 132rpx;
  border-radius: 24rpx;
  background: #eef0f4;
}

.history-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
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
