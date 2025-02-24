<template>
    <div class="bg-white p-5">
        <!-- 头像网名 -->
        <div class="flex items-center mb-5">
            <div class="w-24 h-24 overflow-hidden rounded-full flex justify-center items-center mr-4">
                <img :src="userData.avatar" alt="头像" class="w-full h-auto">
            </div>
            <div class="text-left">
                <div class="text-2xl font-bold">{{ userData.username }}</div>
                <div class="text-lg">{{ userData.greeting }}</div>
            </div>
        </div>

        <div class="flex justify-around mb-5">
            <div class="text-center">
                <span class="text-xl">5623</span>
                <span>积分</span>
            </div>
            <div class="text-center">
                <span class="text-xl">3</span>
                <span>优惠券</span>
            </div>
            <div class="text-center">
                <span class="text-xl">12</span>
                <span>收藏</span>
            </div>
        </div>
        <button class="bg-orange-500 text-white py-2 px-5 rounded mx-auto block">申请入驻商城</button>

        <!-- 我的订单 -->
        <div class="bg-white p-4 rounded shadow mb-5">
            <div class="flex justify-between items-center mb-2">
                <h2 class="text-lg font-semibold">我的订单</h2>
                <span class="flex items-center">
                    全部订单
                    <van-icon name="arrow" size="1.5rem" />
                </span>
            </div>
            <div class="flex justify-between flex-wrap">
                <div class="flex flex-col items-center text-center w-1/5">
                    <van-icon class="iconfont" class-prefix="icon" name="daifukuan" size="2rem" />
                    <span>待付款</span>
                </div>
                <div class="flex flex-col items-center text-center w-1/5">
                    <van-icon class="iconfont" class-prefix="icon" name="daifahuo" size="2rem" />
                    <span>待发货</span>
                </div>
                <div class="flex flex-col items-center text-center w-1/5">
                    <van-icon class="iconfont" class-prefix="icon" name="daishouhuo" size="2rem" />
                    <span>待收货</span>
                </div>
                <div class="flex flex-col items-center text-center w-1/5">
                    <van-icon class="iconfont" class-prefix="icon" name="31daipingjia" size="2rem" />
                    <span>待评价</span>
                </div>
                <div class="flex flex-col items-center text-center w-1/5">
                    <van-icon class="iconfont" class-prefix="icon" name="tuikuanshouhou" size="2rem" />
                    <span>退款/售后</span>
                </div>
            </div>
        </div>

        <!-- 其他 -->
        <div class="mb-5">
            <h2 class="text-lg font-semibold mb-2">其他</h2>
            <ul class="list-none p-0">
                <li class="flex justify-between items-center p-4 border-b border-gray-300 cursor-pointer">
                    购物车
                    <van-icon name="arrow" size="1.5rem" />
                </li>
                <li class="flex justify-between items-center p-4 border-b border-gray-300 cursor-pointer">
                    礼品
                    <van-icon name="arrow" size="1.5rem" />
                </li>
                <li class="flex justify-between items-center p-4 cursor-pointer">
                    收货地址
                    <van-icon name="arrow" size="1.5rem" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMyStore } from '../../stores/myStore';

// 假设从中央仓库获取的数据
const myStore = useMyStore();
const userData = myStore.userInfo;
</script>

<style scoped>
/* 这里可以保留一些特定的样式，如果需要的话 */
</style>