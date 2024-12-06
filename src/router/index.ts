import type { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw, RouteMeta } from 'vue-router'
import { useWorktabStore } from '@/store/modules/worktab'
import Home from '@views/index/index.vue'
import { SystemInfo } from '@/config/setting'
import { useUserStore } from '@/store/modules/user'
import { menuService } from '@/api/menuApi'
import { routerMatch } from '@/utils/menu'
import { useMenuStore } from '@/store/modules/menu'
import { useSettingStore } from '@/store/modules/setting'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { routes, HOME_PAGE } from './routes'
import { roleRoutes } from './roleRoutes'

export { HOME_PAGE, roleRoutes }
export type { AppRouteRecordRaw } from '@/router/types'

// 顶部进度条配置
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 600, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  parent: 'body' //指定进度条的父容器
})


// 创建路由实例
export const router = createRouter({
  history: createWebHashHistory(),  // 使用 hash 模式
  routes: routes as unknown as RouteRecordRaw[],  // 使用类型断言
  scrollBehavior: () => ({ left: 0, top: 0 }) // 页面切换时滚动到顶部
})

// 合并所有路由
export const allRoutes = roleRoutes

// 路由是否已注册的标志
const isRouteRegistered = ref(false)

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 1. 开始进度条
  if (useSettingStore().showNprogress) {
    NProgress.start()
  }

  const userStore = useUserStore()
  const worktabStore = useWorktabStore()
  const { meta, path, params, query } = to
  const { title, title_en: titleEn, notTab, noLogin } = meta

  // 2. 检查登录状态
  if (!userStore.isLogin && path !== '/login' && !noLogin) {
    userStore.logOut()
    next('/login')  // 重定向到登录页
    return
  }

  // 3. 注册动态路由
  if (!isRouteRegistered.value && userStore.isLogin) {
    try {
      await registerRoutes()
      next({ ...to, replace: true })
      return
    } catch (error) {
      console.error('路由注册失败:', error)
      next('/exception/500')
    }
    return
  }

  // 4. 登录页直接通过
  if (path === '/login') {
    isRouteRegistered.value = false
    next()
    return
  }

  // 5. 404处理
  if (to.matched.length === 0) {
    next('/exception/404')
    return
  }

  // 6. 更新工作台标签页
  if (!notTab) {
    worktabStore.router({
      title: title as string,
      title_en: titleEn as string,
      path,
      params,
      query
    })
  }

  // 7. 设置页面标题
  if (title) {
    document.title = `${title} - ${SystemInfo.name}`
  }

  next()
})

// 全局后置守卫
router.afterEach(() => {
  if (useSettingStore().showNprogress) {
    NProgress.done()
  }
})

// 注册动态路由的函数
async function registerRoutes(): Promise<void> {
  try {
    // 1. 获取菜单列表
    const { menuList, closeLoading } = await menuService.getMenuList()

    // 2. 检查菜单列表是否有效
    if (!Array.isArray(menuList) || menuList.length === 0) {
      isRouteRegistered.value = true
      throw new Error('获取菜单列表为空')
    }

    // 3. 存储菜单数据到 store
    useMenuStore().setMenuList(menuList as [])

    // 4. 根据菜单数据动态注册路由
    routerMatch(menuList, roleRoutes)

    // 5. 标记路由已注册
    isRouteRegistered.value = true

    // 6. 关闭加载动画
    closeLoading()
  } catch (error) {
    isRouteRegistered.value = true
    console.error('注册路由失败:', error)
    throw error
  }
}

// 初始化路由的函数
export function initRouter(app: App<Element>) {
  app.use(router)
}