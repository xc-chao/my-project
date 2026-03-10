import { createRouter, createWebHistory } from "vue-router"
// 引入路由，
import type {RouteRecordRaw} from 'vue-router'
// 声明路由类型为 RouteRecordRaw []类型
const rootRoutes :RouteRecordRaw[] = [
    {
        path: 'home',
        name:'Home',
        meta: {
            title: '首页',
            cache: true
        },
        component: () => import('../pages/Home/Home.vue'),
        // 路由懒加载 优化性能
    },
    {
        path: '/shopping',
        name: 'Shopping',
        meta: {
            title: '商品',

            cache: true
        },
        component: () => import('../pages/Shopping/Shopping.vue')
    },

    {
        path: '/my',
        name: 'My',
        meta: {
            title: '我的',
            cache: true
        },
        component: () => import('../pages/My/My.vue')
    },
    {
        path: '/assistant',
        name: 'Assistant',
        meta: {
            title: '助手',
            cache: true
        },
        component: () => import('../pages/Assistant/assistant.vue')
    }
]
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'App',
        component: () => import('../components/Home/TabBar.vue'),
        meta: {
            title: '首页',
            cache: true
        },
        redirect: '/home',
        children: rootRoutes
    }
]

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes
})
// 路由守卫
router.beforeEach((to, from, next) => {
    document.title = to.meta.title as string;
    next();
})
export default router;
