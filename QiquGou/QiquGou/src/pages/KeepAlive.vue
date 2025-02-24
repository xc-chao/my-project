<template>
    <div>
        <router-view v-slot="{ Component }">
            <keep-alive :include="cachedComponents">
                <component :is="Component" />
            </keep-alive>
        </router-view>
        <div class="footer h-12">
            <TabBar class="fixed bottom-0"></TabBar>
        </div>
    </div>
</template>

<script setup lang="ts">
import TabBar from '../components/TaBar.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const cachedComponents=computed(()=>{
    return router.getRoutes().filter(route=>route.meta.cache).map(route=>route.name)
})

</script>

<style lang="scss" scoped></style>