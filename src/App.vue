<template>
  <!-- Element Plus 全局配置提供者 -->
  <el-config-provider :size="elSize" :locale="locales[language]" :z-index="3000">
    <!-- 路由视图出口 -->
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
// 导入用户状态管理
import { useUserStore } from './store/modules/user'
// 导入 Element Plus 的中文和英文语言包
import zh from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
// 导入系统升级检查工具
import { checkSystemUpgrade } from './utils/upgrade'
// 导入状态存储工具
import { initState, saveUserData } from './utils/storage'

// 初始化用户状态管理
const userStore = useUserStore()
// 计算属性：获取当前语言设置
const language = computed(() => userStore.language)
// 计算属性：根据屏幕宽度动态设置组件大小
const elSize = computed(() => (document.body.clientWidth >= 500 ? 'large' : 'default'))

// 语言包配置对象
const locales = {
  zh: zh,  // 中文语言包
  en: en   // 英文语言包
}

// 组件挂载前钩子
onBeforeMount(() => {
  setBodyClass(true)  // 设置主题切换类
})

// 组件挂载后钩子
onMounted(() => {
  initState()        // 初始化状态
  saveUserData()     // 保存用户数据
  setBodyClass(false)  // 移除主题切换类
  checkSystemUpgrade() // 检查系统更新
})

/**
 * 设置或移除 body 的主题切换类
 * 用于提升暗黑主题下页面刷新的视觉体验
 * @param addClass - 是否添加类名
 */
const setBodyClass = (addClass: boolean) => {
  let el = document.getElementsByTagName('body')[0]

  if (addClass) {
    el.setAttribute('class', 'theme-change')
  } else {
    // 延迟移除类名，确保主题切换动画完成
    setTimeout(() => {
      el.removeAttribute('class')
    }, 300)
  }
}
</script>
