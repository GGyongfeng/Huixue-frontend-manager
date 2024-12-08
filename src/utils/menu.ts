import { AppRouteRecordRaw, router } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { MenuListType } from '@/types/menu'
import { LanguageEnum } from '@/enums/appEnum'
import { useUserStore } from '@/store/modules/user'

// 动态匹配路由
export function routerMatch(
  menuList: MenuListType[],    
  roleRoutes: AppRouteRecordRaw[]  
) {
  const routesToAdd: AppRouteRecordRaw[] = []
  menuList.forEach((item) => processMenuItem(item, roleRoutes, routesToAdd))

  routesToAdd.forEach((route) => {
    const { name } = route
    if (name && !router.hasRoute(name)) {
      router.addRoute(route as unknown as RouteRecordRaw)
    }
  })
}

function processMenuItem(
  item: MenuListType,
  roleRoutes: AppRouteRecordRaw[],
  routesToAdd: AppRouteRecordRaw[]
) {
  const { path, children = [], authList = [], title, title_en, noMenu } = item
  const matchingRoute = roleRoutes.find((route) => route.path === path)

  if (matchingRoute) {
    matchingRoute.meta = {
      ...(matchingRoute.meta || {}),
      title,
      title_en,
      authList,
      noMenu
    }

    if (children.length > 0) {
      children.forEach((child) => {
        processMenuItem(child, matchingRoute.children || [], routesToAdd)
      })
    }

    if (!noMenu) {
      routesToAdd.push(matchingRoute)
    }
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
