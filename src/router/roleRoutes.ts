import type { AppRouteRecordRaw } from '@/router/types'
import Home from '@views/index/index.vue'

// 定义需要权限的路由
export const roleRoutes: AppRouteRecordRaw[] = [
    {
      path: '/user',
      name: 'User',
      component: Home,
      meta: {
        title: '成员中心'
      },
      children: [
        {
          path: '/user/user',
          name: 'Users',
          component: () => import('@views/user/User.vue'),
          meta: {
            title: '个人中心'
          }
        }
      ]
    },
    {
      path: '/result',
      name: 'Result',
      component: Home,
      meta: {
        title: '结果页面'
      },
      children: [
        {
          path: '/result/success',
          name: 'Success',
          component: () => import('@views/result/Success.vue'),
          meta: {
            title: '成功页'
          }
        },
        {
          path: '/result/fail',
          name: 'Fail',
          component: () => import('@views/result/Fail.vue'),
          meta: {
            title: '失败页'
          }
        }
      ]
    },
    {
        path: '/tutors',
        component: Home,
        name: 'Tutors',
        meta: {
          title: '家教订单',
          title_en: 'Tutor Orders'
        },
        children: [
          {
            path: '/tutors/list',
            component: () => import('@views/tutors/List.vue'),
            meta: {
              title: '订单列表',
              title_en: 'Order List',
              keepAlive: true
            }
          },
          {
            path: '/tutors/create',
            component: () => import('@views/tutors/Create.vue'),
            meta: {
              title: '新增订单',
              title_en: 'Create Order',
              keepAlive: false
            }
          },
          {
            path: '/tutors/edit',
            component: () => import('@views/tutors/Edit.vue'),
            meta: {
              title: '编辑订单',
              title_en: 'Edit Order',
              keepAlive: false
            }
          }
        ]
      },
      {
        path: '/result',
        name: 'Result',
        component: Home,
        meta: {
          title: '结果页面'
        },
        children: [
          {
            path: '/result/success',
            name: 'Success',
            component: () => import('@views/result/Success.vue'),
            meta: {
              title: '成功页'
            }
          },
          {
            path: '/result/fail',
            name: 'Fail',
            component: () => import('@views/result/Fail.vue'),
            meta: {
              title: '失败页'
            }
          }
        ]
      },
      {
        path: '/plan',
        component: Home,
        name: 'Plan',
        meta: {
          title: '版本计划'
        },
        children: [
          {
            path: '/plan/log',
            component: () => import('@views/plan/log.vue'),
            meta: {
              title: '更新日志'
            }
          }
        ]
      }
  ]