<template>
  <slot />
</template>

<script setup lang="ts">
</script>

<style lang="scss">
@import './uni.scss';

view,
text,
button,
scroll-view,
swiper,
swiper-item,
image {
  box-sizing: border-box;
}

page {
  background: #f7f7fa;
  color: #111111;
  font-family: 'Inter', sans-serif;
}
</style>
