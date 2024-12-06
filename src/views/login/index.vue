<template>
  <div class="login">
    <div class="left-wrap">
      <div class="logo">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zhaopian-copy"></use>
        </svg>
        <h1 class="title">{{ systemName }}</h1>
      </div>
      <img class="left-bg" src="@imgs/login/lf_bg.png" />
      <img class="left-img" src="@imgs/login/lf_icon.svg" />
    </div>
    <div class="right-wrap">
      <div class="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zhaopian-copy"></use>
        </svg>
        <h1>{{ systemName }}</h1>
      </div>
      <div class="login-wrap">
        <div class="form">
          <h3 class="title">欢迎回来</h3>
          <p class="sub-title">输入您的账号和密码登录</p>
          <div class="input-wrap">
            <span class="input-label" v-if="showInputLabel">账号</span>
            <el-input placeholder="请输入账号" size="large" v-model.trim="username" />
          </div>
          <div class="input-wrap">
            <span class="input-label" v-if="showInputLabel">密码</span>
            <el-input
              placeholder="请输入密码"
              size="large"
              v-model.trim="password"
              type="password"
              radius="8px"
              autocomplete="off"
              @keyup.enter="login"
            />
          </div>

          <div class="drag-verify">
            <div class="drag-verify-content" :class="{ error: !isPassing && isClickPass }">
              <DragVerify
                ref="dragVerify"
                v-model:value="isPassing"
                :width="width < 500 ? 328 : 438"
                radius="8px"
                text="按住滑块拖动"
                successText="验证成功"
                :progressBarBg="getCssVariable('--el-color-primary')"
                @pass="onPass"
              />
            </div>
            <p class="error-text" :class="{ 'show-error-text': !isPassing && isClickPass }"
              >请拖动滑块完成验证</p
            >
          </div>

          <div class="forget-password">
            <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
            <!-- <router-link to="/forget-password">忘记密码？</router-link> -->
          </div>

          <div style="margin-top: 30px">
            <el-button
              class="login-btn"
              size="large"
              type="primary"
              @click="login"
              :loading="loading"
            >
              登录
            </el-button>
          </div>

          <!-- <div class="footer">
            <p>
              还没有账号？
              <router-link to="/register">注册</router-link>
            </p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SystemInfo } from '@/config/setting'
  import { ElMessage, ElNotification } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { HOME_PAGE } from '@/router'
  import { ApiStatus } from '@/middleware/status'
  import axios from 'axios'
  import { getCssVariable, getGreeting } from '@/utils/utils'
  import { UserService } from '@/api/usersApi'

  const userStore = useUserStore()
  const router = useRouter()
  const isPassing = ref(false)
  const isClickPass = ref(false)
  const showInputLabel = ref(false)

  const systemName = SystemInfo.name
  const username = ref(localStorage.getItem('lastLoginUsername') || '')
  const password = ref(localStorage.getItem('rememberPassword') === 'true' 
    ? localStorage.getItem('lastLoginPassword') || ''
    : '')
  const loading = ref(false)
  const rememberPassword = ref(localStorage.getItem('rememberPassword') === 'true')
  const { width } = useWindowSize()

  const onPass = () => {}

  const saveLoginInfo = () => {
    localStorage.setItem('lastLoginUsername', username.value)
    
    if (rememberPassword.value) {
      localStorage.setItem('lastLoginPassword', password.value)
      localStorage.setItem('rememberPassword', 'true')
    } else {
      localStorage.removeItem('lastLoginPassword')
      localStorage.setItem('rememberPassword', 'false')
    }
  }

  const login = async () => {
    if (!username.value) {
      ElMessage.error('请输入账号')
      return
    }

    if (!password.value) {
      ElMessage.error('请输入密码')
      return
    }

    if (!isPassing.value) {
      isClickPass.value = true
      return
    }

    loading.value = true

    const params = {
      username: username.value,
      password: password.value
    }

    try {
      const res = await UserService.login(params);

      if (res.code === ApiStatus.success) {
        // 保存登录信息到本地存储（如 localStorage），用于持久化登录状态
        saveLoginInfo();

        // 从响应中获取用户数据
        const userData = res.data;
        console.log('登录用户信息:', userData);
        
        // 将用户信息存储到 Pinia store 中，包含用户基本信息、权限等
        userStore.setUserInfo(userData);

        // 更新登录状态为已登录
        userStore.setLoginStatus(true);

        // 显示登录成功的提示消息（使用 Element Plus 的消息通知）
        showLoginSuccessNotice();

        // 登录成功后跳转到系统首页（通常是 dashboard）
        router.push(HOME_PAGE);
      } else {
        ElMessage.error(res.message || '登录失败');
      }
    } catch (error) {
      console.error('登录错误:', error);
      ElMessage.error('网络错误，请检查服务器连接');
    } finally {
      loading.value = false;
    }
  }

  watch(rememberPassword, (newVal) => {
    if (!newVal) {
      localStorage.removeItem('lastLoginPassword')
      localStorage.setItem('rememberPassword', 'false')
    } else {
      localStorage.setItem('rememberPassword', 'true')
      if (password.value) {
        localStorage.setItem('lastLoginPassword', password.value)
      }
    }
  })

  // 登录成功提示
  const showLoginSuccessNotice = () => {
    setTimeout(() => {
      ElNotification({
        title: getGreeting(),
        type: 'success',
        showClose: false,
        duration: 3000,
        message: `欢迎登录 ${systemName}`
      })
    }, 300)
  }
</script>

<style lang="scss" scoped>
  @use './index';
</style>
