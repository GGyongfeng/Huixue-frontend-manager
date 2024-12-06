import { AppRouteRecordRaw, router } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { MenuListType } from '@/types/menu'
import { LanguageEnum } from '@/enums/appEnum'
import { useUserStore } from '@/store/modules/user'

// 动态匹配路由
export function routerMatch(
  menuList: MenuListType[],    // 后端返回的菜单列表
  roleRoutes: AppRouteRecordRaw[]  // 前端定义的权限路由
) {
  // 用于存储需要添加的路由
  const routesToAdd: AppRouteRecordRaw[] = []

  // 处理每个菜单项
  menuList.forEach((item) => processMenuItem(item, roleRoutes, routesToAdd))

  // 遍历需要添加的路由
  routesToAdd.forEach((route) => {
    const { name } = route
    // 如果路由有名字且还未注册
    if (name && !router.hasRoute(name)) {
      // 动态添加路由
      router.addRoute(route as unknown as RouteRecordRaw)
    }
  })
}

function processMenuItem(
  item: MenuListType,
  roleRoutes: AppRouteRecordRaw[],
  routesToAdd: AppRouteRecordRaw[]
) {
  const { path, children = [], authList = [], title, title_en } = item

  const matchingRoute = roleRoutes.find((route) => route.path === path)

  if (matchingRoute) {
    matchingRoute.meta = {
      ...(matchingRoute.meta || {}),
      title,
      title_en,
      authList // 直接将 authList 添加到 meta 中
    }

    if (children.length > 0) {
      children.forEach((child) => processMenuItem(child, matchingRoute.children || [], routesToAdd))
    }

    routesToAdd.push(matchingRoute)
  } else {
    // 匹配不上的路由
    // console.error('【动态添加路由】找不到与路径匹配的路由:', path);
  }
}

// 菜单标题映射
const titlePropertyMap = {
  [LanguageEnum.ZH]: 'title',
  [LanguageEnum.EN]: 'title_en'
}

const getTitleProp = () => {
  return titlePropertyMap[useUserStore().language]
}

// 获取多语言菜单标题
export const getMenuTitle = (item: any) => {
  return item[getTitleProp()]
}

// 获取 meta 多语言菜单标题
export const getMetaMenuTitle = (item: any) => {
  return item.meta[getTitleProp()]
}
