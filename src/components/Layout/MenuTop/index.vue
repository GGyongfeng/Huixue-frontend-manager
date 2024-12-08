<template>
  <div class="menu-top">
    <el-menu
      :ellipsis="true"
      class="el-menu-popper-demo"
      mode="horizontal"
      :default-active="routerPath"
      text-color="var(--art-text-gray-700)"
      :popper-offset="16"
      :style="{ width: width + 'px' }"
      background-color="transparent"
    >
      <MenuTopSubmenu
        v-for="item in visibleMenuList"
        :key="item.id"
        :item="item"
        :isMobile="false"
        :level="0"
      />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
  import { MenuListType } from '@/types/menu'

  const route = useRoute()

  const props = defineProps({
    list: {
      type: [Array] as PropType<MenuListType[]>,
      default: () => []
    },
    width: {
      type: Number,
      default: 500
    }
  })

  // 过滤掉带有 noMenu: true 的菜单项
  const visibleMenuList = computed(() => {
    const filterNoMenuItems = (items: MenuListType[]): MenuListType[] => {
      return items.filter(item => {
        // 如果当前项有 noMenu: true，则过滤掉
        if (item.noMenu) {
          return false
        }
        
        // 如果有子菜单，递归过滤
        if (item.children && item.children.length > 0) {
          item.children = filterNoMenuItems(item.children)
        }
        
        return true
      })
    }
    
    return filterNoMenuItems(props.list)
  })

  const routerPath = computed(() => {
    return route.path
  })
</script>

<style lang="scss" scoped>
  // :deep(.el-menu--horizontal > .el-sub-menu.is-active) {
  //   background-color: #eee;
  // }

  :deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title) {
    border: 0 !important;
  }

  .menu-top {
    .el-menu {
      border: none;
    }
  }
</style>
