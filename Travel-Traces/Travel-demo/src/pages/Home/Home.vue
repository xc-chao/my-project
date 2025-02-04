<template>
    <div class="home-container flex flex-col items-start">
        <!-- 顶部导航栏 -->
        <div class="flex items-center justify-between p-4 bg-white shadow">
            <div class="text-xl font-bold">携程旅行</div>
            <div class="relative flex items-center w-[1rem]">
                <van-search
                    v-model="searchQuery"
                    placeholder="搜索任何旅游相关"
                    class="w-[1rem]"
                />
                <van-button class="absolute right-0" type="primary" icon="search" />
            </div>



            <div class="flex space-x-4">
                <van-button class="text-gray-600">登录</van-button>
                <van-button class="text-gray-600">注册</van-button>
            </div>
        </div>
        <!-- 背景 -->
        <!-- ... existing code ... -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchQuery: ''
        };
    }
};
</script>

<style scoped>

</style>