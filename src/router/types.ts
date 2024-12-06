import type { RouteMeta } from 'vue-router'

// 扩展 Meta 类型
interface AppRouteMeta extends RouteMeta {
  title?: string
  title_en?: string
  keepAlive?: boolean
  notTab?: boolean
  noLogin?: boolean
}

// 扩展路由记录类型
export type AppRouteRecordRaw = {
  path: string
  name?: string
  redirect?: string
  component?: any
  children?: AppRouteRecordRaw[]
  meta?: AppRouteMeta
  hidden?: boolean
} 