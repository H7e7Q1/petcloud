import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/userInfo',
                name: 'userInfo',
                meta: {
                    title: '个人信息',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/userCenter/userInfo.vue'),
            },       
            {
                path: '/petInfo',
                name: 'petInfo',
                meta: {
                    title: '宠物信息',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/petManage/index.vue'),
            },
            {
                path: '/productManage',
                name: 'productManage',
                meta: {
                    title: '商品管理',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/productManage/index.vue'),
            },
            {
                path: '/productOrder',
                name: 'productOrder',
                meta: {
                    title: '商品订单',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/orderManage/productOrder.vue'),
            },
            {
                path: '/petOrder',
                name: 'petOrder',
                meta: {
                    title: '宠物订单',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/orderManage/petOrder.vue'),
            },
            {
                path: '/petServiceOrder',
                name: 'petServiceOrder',
                meta: {
                    title: '宠物服务订单',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/orderManage/petServiceOrder.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '用户',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/userManage/index.vue'),
            },
            {
                path: '/petService',
                name: 'petService',
                meta: {
                    title: '宠物服务管理',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/petService/index.vue'),
            },
            {
                path: '/petKnowledge',
                name: 'petKnowledge',
                meta: {
                    title: '宠物知识管理',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/petKnowledge/index.vue'),
            }
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    const token = localStorage.getItem('token');
    if (!token && to.path !== '/login') {
        next('/login');
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done()
})

export default router;
