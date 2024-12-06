import { BaseResult } from '@/types/axios'
import { MenuListType } from '@/types/menu'

/**
 * 菜单API响应类型
 * 继承自BaseResult，包含菜单列表数据
 */
export interface MenuResponse extends BaseResult {
  code: number;
  data: MenuListType[];
  message: string;
}

/**
 * 菜单响应结果类型
 * 包含菜单列表和关闭加载状态的方法
 */
export interface MenuResult {
  menuList: MenuListType[];
  closeLoading: () => void;
} 