import type { AppRouteRecordRaw } from '@/router/types'
import Home from '@views/index/index.vue'

// 定义系统首页路径
export const HOME_PAGE = '/dashboard/console'

// 定义基础路由（不需要权限的路由）
export const routes = [
  {
    path: '/',
    redirect: HOME_PAGE    // 重定向到首页
  },
  {
    path: '/dashboard',
    component: Home,
    meta: {
      title: '监控中心',
      title_en: 'Dashboard'
    },
    children: [
      {
        path: 'console',
        name: 'Console',
        component: () => import(`@views/dashboard/console/index.vue`),
        meta: {
          title: '工作台',
          title_en: 'Workbench',
          keepAlive: false
        }
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import(`@views/dashboard/analysis/index.vue`),
        meta: {
          title: '分析页',
          title_en: 'Workbench',
          keepAlive: false
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@views/login/index.vue'),
    meta: {
      title: '登录',
      notTab: true
    }
  },
  {
    path: '/register',
    component: () => import('@views/register/index.vue'),
    meta: {
      title: '注册',
      notTab: true,
      noLogin: true
    }
  },
  {
    path: '/forget-password',
    component: () => import('@views/forget-password/index.vue'),
    meta: {
      title: '忘记密码',
      notTab: true,
      noLogin: true
    }
  },
  {
    path: '/exception',
    component: Home,
    meta: {
      title: '异常页面',
      title_en: 'Exception',
      keepAlive: true
    },
    children: [
      {
        path: '403',
        component: () => import('@/views/exception/403.vue'),
        meta: {
          title: '403',
          title_en: '403',
          keepAlive: true
        }
      },
      {
        path: '404',
        component: () => import('@views/exception/404.vue'),
        meta: {
          title: '404',
          title_en: '404',
          keepAlive: true
        }
      },
      {
        path: '500',
        component: () => import('@views/exception/500.vue'),
        meta: {
          title: '500',
          title_en: '500',
          keepAlive: true
        }
      }
    ]
  }
] as AppRouteRecordRaw[]