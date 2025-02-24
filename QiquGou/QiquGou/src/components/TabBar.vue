<template>
    <router-view />
    <van-tabbar v-model="active" class="bg-white shadow-lg">
        <van-tabbar-item icon="wap-home" to="/home">首页</van-tabbar-item>
        <van-tabbar-item icon="chat-o" to="/assistant">AI助手</van-tabbar-item>
        <van-tabbar-item icon="shopping-cart-o" to="/shopping">购物车</van-tabbar-item>
        <van-tabbar-item icon="manager" to="/my">我的</van-tabbar-item>
    </van-tabbar>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
// 获取当前路由
const active = ref<number>(1);
onMounted(() => {
  // 获取当前路由的路径
  const route = useRoute();
  if (route.path == "/home") {
    active.value = 0; 
  }
  else if (route.path == "/shopping") {
    active.value = 2; 
  }

  else if (route.path == "/my") {
    active.value = 3; 
  }
  else if(route.path == "/assistant") {
    active.value = 1;
  }
})

</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>