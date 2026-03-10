<template>
    <router-view />
    <van-tabbar v-model="active" 
    class="shadow-black shadow-2xl opacity-90">
      <van-tabbar-item to="/assistant">
        <template #icon>
          <span class="iconfont icon-zhinengAIzhushou"></span>
        </template>  
      </van-tabbar-item>
      <van-tabbar-item icon="wap-home" to="/home">首页</van-tabbar-item>

      <van-tabbar-item icon="shopping-cart-o" to="/shopping">订单</van-tabbar-item>
      <van-tabbar-item icon="manager" to="/my">我的</van-tabbar-item>
    </van-tabbar>
    

  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  // 获取当前路由
  // const route = useRoute();
  const active = ref<number>(1);
  onMounted(() => {
    // 获取当前路由的路径
    const route = useRoute();
    console.log(route.path);
    if (route.path == "/home") {
      active.value = 1; 
    }
    else if (route.path == "/shopping") {
      active.value = 2; 
    }

    else if (route.path == "/my") {
      active.value = 3; 
    }
    else if (route.path == "/assistant") {
      active.value = 0;
    }
  })
  </script>
  
  <style scoped>
  
  </style>