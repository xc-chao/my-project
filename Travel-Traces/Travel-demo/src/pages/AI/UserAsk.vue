<template>
  <div class="flex py-2">
    <div
      class="relative rounded-lg bg-violet-200 border border-gray-300 px-4 py-2 ml-auto mr-4 text-gray-700 max-w-56"
    >
      <div class="avatar absolute top-2 -right-7">
        <van-icon name="user" size="1.5rem" color="#66666"/>
      </div>
      <p v-html="props.msg"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
   msg: string;
}
const props = defineProps<Props>();
</script>

<style lang="less" scoped>
/* Add any additional styles here if needed */
</style>