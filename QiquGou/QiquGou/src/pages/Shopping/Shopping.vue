<!-- Start of Selection -->
<template>
    <!-- 购物车 -->
    <div class="shop-container relative">
        <!-- 购物车头部 -->
        <div class="shop-header">
            <div class="shop-header-top flex items-center justify-between">
                <h1 class="text-xl font-bold">购物车</h1>
                <!-- End of Selection -->
                <van-search v-model="searchField" placeholder="搜索购物车商品" show-action  background="transparent" class="flex-grow mx-4">
                    <template #action>
                        <div class="text-black justify-center items-center flex">
                            <h1 class="text-xl">管理</h1>
                        </div>
                    </template>
                </van-search>
            </div>
        </div>
        <!-- 提示信息 -->
        <div class="shop-message flex space-x-4">
            <!-- 满减活动 -->
            <div class="flex items-center bg-red-100 text-red-600 px-4 py-2 rounded-md">
                <van-icon name="discount"/>
                <span class="ml-2">每300减40</span>
            </div>
            <!-- 优惠卷 -->
            <div class="flex items-center bg-yellow-100 text-yellow-600 px-4 py-2 rounded-md">
                <van-icon name="folder" />
                <span class="ml-2">分组</span>
            </div>
            <!-- 降价提醒 -->
            <div class="flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-md">
                <van-icon name="arrow-down" />
                <span class="ml-2">降价</span>
            </div>
            <!-- 常购 -->
            <div class="flex items-center bg-green-100 text-green-600 px-4 py-2 rounded-md">
                <van-icon name="cart" />
                <span class="ml-2">常购</span>
            </div>
        </div>
        <!-- 商品列表和喜欢推荐 -->
        <div class="shop-main">
            <div class="product-list overflow-y-auto h-[calc(100vh-200px)]">
                <!-- 商品列表 -->
                <div v-for="(product, index) in products" :key="index" class="product-item flex items-start border-b border-gray-300 py-4">
                    <input type="checkbox" v-model="selectedProducts" :value="product" class="form-checkbox h-6 w-6 text-blue-600 rounded mr-4" />
                    <img :src="product.image" alt="商品图片" class="w-24 h-24 object-cover mr-4" />
                    <div class="flex-grow">
                        <div class="flex items-center">
                            <van-icon class="iconfont" class-prefix="icon" name="shangdian2" size="1.5rem" color="lightpink"/>
                            <span class="text-gray-700 font-semibold">{{ product.storeName }}</span>
                            <van-icon name="arrow" class="ml-2" />
                        </div>
                        <h2 class="text-lg font-bold">{{ product.name }}</h2> 
                        <p class="text-gray-600">
                            {{ product.color }}；{{ product.size }} 
                            <van-icon class="iconfont ml-32" class-prefix="icon" name="jianhao1" size="1.5rem" />
                        </p>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-red-600 font-bold">¥{{ product.salePrice.toFixed(2) }}</span>
                            <span class="text-gray-500 line-through">¥{{ product.originalPrice.toFixed(2) }}</span>
                            <span class="text-green-600">降价 ¥{{ product.discount.toFixed(2) }}</span>
                        </div>
                    </div>
                </div>

                <!-- 猜你喜欢 -->
                <div class="flex justify-between items-center mt-4">
                    <h3 class="text-lg font-bold">猜你喜欢 <van-icon name="like" class="ml-2" style="color: pink;"/></h3>
                    <div class="flex items-center">
                        <h3 class="text-sm">更多<van-icon name="arrow" class="ml-2" /></h3>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div v-for="(item, index) in likeProduct" :key="index" class="bg-white rounded-lg border border-gray-300 p-4 shadow-md">
                        <img :src="item.image" alt="推荐商品" class="w-full h-32 object-cover rounded-lg" />
                        <h3 class="text-lg font-bold mt-2">{{ item.name }}</h3>
                        <p class="text-gray-500 mt-1" style="color: red;">价格: ¥{{ item.price }}</p>
                        <p class="text-sm">{{ item.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 统计价格 -->
        <div class="absolute bottom--4 left-0 right-0 flex items-center justify-between bg-white p-4 shadow-md">
            <label class="flex items-center">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="form-checkbox h-5 w-5 text-blue-600 rounded mr-2" />
                <span>全选</span>
            </label>
            <span class="text-lg">合计: <span class="text-orange-500">¥{{ totalPrice.toFixed(2) }}</span></span>
            <button class="bg-orange-500 text-white px-4 py-2 rounded">结算</button>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import { useShopStore } from '../../stores/shopStore';
import { Product } from '../../types/shopType';

const shopStore = useShopStore();
const { shopList: products, likeProduct } = shopStore;

const selectedProducts = ref<Product[]>([]);
const selectAll = ref(false);
const searchField = ref('');

// 计算总价格
const totalPrice = computed(() => {
    return selectedProducts.value.reduce((total, product) => total + product.salePrice, 0);
});

// 切换全选
const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedProducts.value = products.slice(); // 选择所有商品
    } else {
        selectedProducts.value = []; // 清空选择
    }
};
</script>

<style scoped>
.product-list {
    max-height: calc(100vh - 122px); /* Set a maximum height for the product list */
    overflow-y: auto; /* Enable vertical scrolling */
}

.recommendations {
    margin-top: 20px; /* Add some space above the recommendations */
}

.recommendation-item {
    display: flex;
    align-items: center;
    margin: 10px 0;
}
</style>