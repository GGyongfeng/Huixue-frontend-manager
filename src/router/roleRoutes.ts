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
        },
        {
          path: '/user/account',
          name: 'Account',
          component: () => import('@views/user/Account.vue'),
          meta: {
            title: '账号管理',
            keepAlive: true
          }
        },
        {
          path: '/user/department',
          name: 'Department',
          component: () => import('@views/user/Department.vue'),
          meta: {
            title: '部门管理',
            keepAlive: true
          }
        },
        {
          path: '/user/role',
          name: 'Role',
          component: () => import('@views/user/Role.vue'),
          meta: {
            title: '角色权限',
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Home,
      meta: {
        title: '菜单管理',
        title_en: 'Menu Management'
      },
      children: [
        {
          path: '/menu/menu',
          name: 'Menus',
          component: () => import('@views/menu/Menu.vue'),
          meta: {
            title: '菜单管理',
            title_en: 'Menu Management',
            keepAlive: true
          }
        },
        {
          path: '/menu/permission',
          name: 'Permission',
          component: () => import('@views/menu/Permission.vue'),
          meta: {
            title: '权限控制',
            title_en: 'Permission Control',
            keepAlive: true
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
      path: '/article',
      component: Home,
      name: 'Article',
      meta: {
        title: '文章管理'
      },
      children: [
        {
          path: '/article/article-publish',
          component: () => import('@views/article/ArticlePublish.vue'),
          meta: {
            title: '文章发布',
            keepAlive: false
          }
        },
        {
          path: '/article/article-list',
          component: () => import('@views/article/ArticleList.vue'),
          meta: {
            title: '文章列表',
            keepAlive: true
          }
        },
        {
          path: '/article/detail',
          component: () => import('@views/article/ArticleDetail.vue'),
          meta: {
            title: '文章详情',
            keepAlive: false,
            notTab: true
          }
        },
        {
          path: '/article/classify',
          component: () => import('@views/article/Classify.vue'),
          meta: {
            title: '文章分类',
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/widgets',
      component: Home,
      name: 'Widgets',
      meta: {
        title: '组件'
      },
      children: [
        {
          path: '/widgets/icons',
          component: () => import('@/components/Icons/icon-vue.vue'),
          meta: {
            title: '图标列表',
            title_en: 'Icon List',
            keepAlive: true
          }
        },
        {
          path: '/widgets/icon-list',
          component: () => import('@views/widgets/IconList.vue'),
          meta: {
            title: '图标库',
            keepAlive: true
          }
        },
        {
          path: '/widgets/icon-selector',
          component: () => import('@views/widgets/IconSelector.vue'),
          meta: {
            title: '图标选择器',
            keepAlive: true
          }
        },
        {
          path: '/article/comment',
          component: () => import('@views/article/Comment.vue'),
          meta: {
            title: '留言',
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/message',
      component: Home,
      name: 'Message',
      meta: {
        title: '消息中心'
      },
      children: [
        {
          path: '/message/message',
          component: () => import('@views/message/Index.vue'),
          meta: {
            title: '系统消息',
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/system',
      component: Home,
      name: 'System',
      meta: {
        title: '系统设置'
      },
      children: [
        {
          path: '/system/setting',
          component: () => import('@views/system/Setting.vue'),
          meta: {
            title: '系统设置',
            keepAlive: true
          }
        },
        {
          path: '/system/api',
          name: 'Api',
          component: () => import('@views/system/Api.vue'),
          meta: {
            title: 'API管理'
          }
        },
        {
          path: '/system/log',
          component: () => import('@views/system/Log.vue'),
          meta: {
            title: '系统日志',
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/safeguard',
      component: Home,
      name: 'Safeguard',
      meta: {
        title: '运维管理'
      },
      children: [
        {
          path: '/safeguard/server',
          component: () => import('@views/safeguard/Server.vue'),
          meta: {
            title: '服务器管理',
            keepAlive: true
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
          path: '/plan/index',
          component: () => import('@views/plan/index.vue'),
          meta: {
            title: '更新计划',
            keepAlive: true
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
            path: '/tutors/edit/:id',
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
        path: '/onlyme',
        component: Home,
        name: 'OnlyMe',
        meta: {
          title: '其他'
        },
        children: [
            {
                path: '/widgets/notification',
                component: () => import('@views/widgets/Notification.vue'),
                meta: {
                  title: '通知',
                  keepAlive: true
                }
            },
            {
              path: '/widgets/icons-vue',
              component: () => import('@/components/Icons/icon-vue.vue'),
              meta: {
                title: '图标列表',
                title_en: 'Icon List',
                keepAlive: true
              }
            }
        ]
      }
  ]