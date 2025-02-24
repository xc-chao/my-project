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
          <div class="flex flex-col rounded-lg bg-white w-full h-full items-center justify-center  border-2 border-gray-300">
            <img :src="image.url" alt="轮播图" class="w-full h-full object-cover rounded-lg" >
            <div class="text-sm p-2 pb-0 font-bold">
              {{ image.title }}
              <div class="text-xs font-normal text-gray-500">{{ image.description }}</div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>

    <!-- 限时秒杀 -->
    <div class="flex space-x-2 mt-4">
            <div class="flex-1 bg-red-100 rounded-lg border border-gray-300 p-4 shadow-md">
                <div class="flex justify-between items-center">
                    <h3 class="text-m font-bold">限时秒杀</h3>
                    <p class="text-sm text-gray-500">仅剩 {{ remainingTime }}</p>
                </div>
                <div class="flex justify-center mt-2">
                    <div v-for="(item, index) in flashSales" :key="index" class="text-center text-red-500 mx-1">
                        <img :src="item.image" alt="商品" class="w-32 h-32 object-cover rounded-lg" />
                        <p class="font-bold">{{ item.title }}: ¥{{ item.price }}</p>
                    </div>
                </div>
            </div>
            <!-- 官方补贴 -->
            <div class="flex-1 bg-red-100 rounded-lg border border-gray-300 p-4 shadow-md">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold">官方补贴</h3>
                </div>
                <div class="flex justify-center mt-2">
                    <div v-for="(item, index) in officialSubsidies" :key="index" class="text-center text-red-500 mx-1">
                        <img :src="item.image" alt="商品" class="w-32 h-32 object-cover rounded-lg" />
                        <p class="font-bold">{{ item.title }}: ¥{{ item.price }}</p>
                    </div>
                </div>
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
    <!-- 回到顶部 -->
    <van-icon 
        class="iconfont fixed bottom-4 right-4 cursor-pointer z-50" 
        class-prefix="icon" 
        name="shanghua" 
        size="2rem"
        @click="scrollToTop" 
        color="lightgreen"
    />
</template>

<script>
import { useHomeStore } from '../../stores/homeStore'; // 确保路径正确
import { ref, toRefs, onMounted, computed } from 'vue';

export default {
  setup() {
    const searchField = ref('');
    const homeStore = useHomeStore();
    const { images, selectProduct, flashSales, officialSubsidies } = toRefs(homeStore);
    
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
      // floor 向下取整
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    return {
      searchField,
      images,
      selectProduct,
      scrollToTop,
      remainingTime: computed(() => formatTime(remainingTime.value)), // 格式化剩余时间
      flashSales,
      officialSubsidies
    };
  },
};
</script>


<style scoped>
/* 这里可以保留一些特定的样式，如果需要的话 */
.iconfont {
    position:fixed;
    /* 确保图标在页面最上方 */
    z-index: 50; /* 确保图标在其他内容之上 */
    /* 添加一些样式以确保图标可见 */
    /*background: rgb(252, 253, 253); /* 可选：添加背景以提高可见性 */
    /*border-radius: 50%;  /* 可选：使图标背景为圆形 */
    padding: 8px; /* 可选：增加图标的点击区域 */
    margin-left: 80%;
    margin-bottom: 10%;
}
</style>