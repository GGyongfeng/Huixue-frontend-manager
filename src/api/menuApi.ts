import { fourDotsSpinnerSvg } from '@/assets/svg/loading'
import { ElLoading } from 'element-plus'
import request from '@/middleware'
import { MenuResponse, MenuResult } from './model/menuModel'
import { MenuListType } from '@/types/menu'

/**
 * 菜单服务
 * 提供菜单相关的API方法
 */
export const menuService = {
  /**
   * 获取菜单列表
   * @returns Promise<MenuResult> 返回菜单列表数据和关闭加载状态的方法
   */
  getMenuList() {
    const loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0)',
      svg: fourDotsSpinnerSvg,
      svgViewBox: '0 0 40 40'
    })
    
    const url = '/api/manager/menu/list'
    
    try {
      return new Promise<MenuResult>((resolve, reject) => {
        const requestConfig = {
          url,
          headers: {
            'Content-Type': 'application/json'
          }
        }
        
        request.get<MenuResponse>(requestConfig)
          .then(res => {
            if (res.code === 200) {
              // 处理图标数据
              // 处理\u的转义问题
              const processIcons = (menuItems: MenuListType[]): MenuListType[] => {
                return menuItems.map((item: MenuListType): MenuListType => ({
                  ...item,
                  icon: item.icon ? String.fromCharCode(parseInt(item.icon, 16)) : item.icon,
                  children: item.children ? processIcons(item.children) : []
                }))
              }
              
              const processedData = processIcons(res.data)
              
              resolve({
                menuList: processedData,
                closeLoading: () => loading.close()
              })
            } else {
              throw new Error(res.message || '获取菜单失败')
            }
          })
          .catch(error => {
            loading.close()
            reject(error)
          })
      })
    } catch (error) {
      loading.close()
      throw error
    }
  }
}