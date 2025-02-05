<template>
    <div class="home-container flex flex-col items-start bg-blue-200">
        <!-- 顶部导航栏 -->
        <div class="search flex items-center px-5 py-4 text-sm">
      <div
        class="title font-bold text-gray-900 text-lg w-[6rem] text-center font-serif mr-5 bg-gray-200 rounded-full bg-opacity-50" 
      >
        奇趣购QiquGou
      </div>
      <van-search
        v-model="searchField"
        placeholder="请输入搜索关键字"
        show-action
        shape="round"
        background="transparent"
        class="w-full"
      >
        <template #action>
          <div class="text-black justify-center items-center flex">
            <van-icon name="location" size="1.45rem" />定位
          </div>
        </template>
      </van-search>
      </div>
    </div>

    <!-- 商品种类 -->
    <div class="flex justify-around w-full py-4 bg-opacity-50 bg-gray-100">
      <div class="text-center">
        <span class="iconfont icon-food text-2xl"></span>
        <div>食品</div>
      </div>
      <div class="text-center">
        <span class="iconfont icon-seafood text-2xl"></span>
        <div>生鲜</div>
      </div>
      <div class="text-center">
        <span class="iconfont icon-goods text-2xl"></span>
        <div>百货</div>
      </div>
      <div class="text-center">
        <span class="iconfont icon-appliance text-2xl"></span>
        <div>电器</div>
      </div>
      <div class="text-center">
        <span class="iconfont icon-beauty text-2xl"></span>
        <div>美妆</div>
      </div>
      <div class="text-center">
        <van-icon name="descending" size="1.5rem" />
      </div>
    </div>

    <!-- 轮播图 -->
      <van-swipe class="my-swipe" :autoplay="2000">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <div class="flex flex-col rounded-lg bg-white w-full h-full items-center justify-center border-dashed border-2 border-gray-300">
            <img :src="image.url" alt="轮播图" class="w-full h-full object-cover rounded-lg" >
            <div class="text-sm p-2 pb-0 font-bold">
              {{ image.title }}
              <div class="text-xs font-normal text-gray-500">{{ image.description }}</div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    <!-- 重磅消息 -->
    <div class="bg-red-100 rounded-lg border border-gray-300 p-4 shadow-md mt-4 flex items-center">
      <img src="https://gw.alicdn.com/bao/uploaded/i3/920063449/O1CN01i2p3Wc1bLh14Hzvo7_!!920063449.jpg_.webp" alt="商品" class="w-25 h-36 object-cover rounded-lg ml-4" />
      <div class="flex-1 ml-4">
        <h3 class="text-lg font-bold">限时秒杀</h3>
        <p class="text-red-500 font-bold">秒杀价: ¥225</p>
        <p class="text-gray-500">仅剩 {{ remainingTime }}</p>
      </div>
    </div>
    <!-- 商品推荐 -->
    <div class="product-recommendations grid grid-cols-2 gap-4 p-4 bg-gray-100">
      <div v-for="(product, index) in selectProduct" :key="index" class="bg-white rounded-lg border border-gray-300 p-4 shadow-md">
        <img :src="product.image" alt="商品" class="w-full h-32 object-cover rounded-lg" />
        <h3 class="text-lg font-bold mt-2">{{ product.name }}</h3>
        <p class="text-gray-500 mt-1">{{ product.description }}</p>
        <div class="flex justify-between items-center mt-2">
          <p class="text-red-500 font-bold">{{ product.price }}元</p>
          <p class="text-gray-500 text-sm ml-2">{{ product.sales }}</p>
        </div>
      </div>
    </div>
</template>

<script>
import { useHomeStore } from '../../stores/homeStore'; // 确保路径正确
import { ref, toRefs, onMounted, computed } from 'vue';

export default {
  setup() {
    const searchField = ref('');
    const homeStore = useHomeStore();
    const { images, selectProduct } = toRefs(homeStore);
    
    const remainingTime = ref(7350); // 初始剩余时间（以秒为单位）

    // 模拟动态更新剩余时间
    onMounted(() => {
      setInterval(() => {
        if (remainingTime.value > 0) {
          remainingTime.value--;
        }
      }, 1000);
    });

    // 计算剩余时间格式
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return {
      searchField,
      images,
      selectProduct,
      remainingTime: computed(() => formatTime(remainingTime.value)), // 格式化剩余时间
    };
  },
};
</script>


<style scoped>
/* 这里可以保留一些特定的样式，如果需要的话 */
</style>