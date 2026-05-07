<template>
  <slot />
</template>

<script setup lang="ts">
</script>

<style lang="scss">
page {
  min-height: 100%;
  background: #f7f7fa;
  color: #111111;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

view,
text,
button,
scroll-view,
swiper,
swiper-item,
image,
input,
textarea,
switch,
checkbox,
radio,
label,
form,
movable-area,
movable-view {
  box-sizing: border-box;
}

.page-shell {
  min-height: 100vh;
  background: #f7f7fa;
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* #ifdef MP-WEIXIN */
.page-shell {
  min-height: 100vh;
  min-height: 100dvh;
}

.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

scroll-view {
  box-sizing: border-box;
}
/* #endif */
</style>
