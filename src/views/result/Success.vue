<template>
  <div class="page-content success">
    <i class="iconfont-sys icon">&#xe617;</i>
    <h1 class="title">{{ title }}</h1>
    
    <!-- 默认提示信息，可以通过 hideMsg 隐藏 -->
    <p v-if="!hideMsg" class="msg" style="white-space: pre-line">
      {{ subTitle }}
    </p>

    <!-- 额外信息区域 -->
    <div v-if="extraInfo" class="res">
      <p style="white-space: pre-wrap;">{{ extraInfo }}</p>
    </div>

    <!-- 按钮组 -->
    <div class="btn-group">
      <!-- 返回按钮 -->
      <el-button 
        v-if="backPath"
        type="primary" 
        @click="handleBack"
      >
        返回列表
      </el-button>

      <!-- 查看按钮 -->
      <el-button 
        v-if="detailPath"
        @click="handleView"
      >
        查看详情
      </el-button>

      <!-- 打印按钮，可选 -->
      <el-button v-if="showPrint" @click="handlePrint">打印</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">

// 成功调用方法：
// router.push({
//   path: '/result/success',
//   query: {
//     title: '创建成功',
//     subTitle: '订单号: xxx',
//     backPath: '/tutors/list',
//     detailPath: '/tutors/detail/xxx',
//     extraInfo: '自定义提示信息',
//     hideMsg: 'true',  // 隐藏默认提示
//     showPrint: 'true' // 显示打印按钮
//   }
// })


import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 从路由参数中获取配置
const title = computed(() => route.query.title as string || '提交成功')
const subTitle = computed(() => route.query.subTitle as string)
const extraInfo = computed(() => route.query.extraInfo as string || '已提交申请，等待部门审核。')
const backPath = computed(() => route.query.backPath as string)
const detailPath = computed(() => route.query.detailPath as string)
const hideMsg = computed(() => route.query.hideMsg === 'true')
const showPrint = computed(() => route.query.showPrint === 'true')

// 返回列表
const handleBack = () => {
  if (backPath.value) {
    router.push(backPath.value)
  } else {
    router.back()
  }
}

// 查看详情
const handleView = () => {
  if (detailPath.value) {
    router.push(detailPath.value)
  }
}

// 打印功能
const handlePrint = () => {
  window.print()
}
</script>

<style lang="scss" scoped>
.success {
  box-sizing: border-box;
  padding: 15px 100px !important;
  text-align: center;

  .icon {
    display: block;
    margin-top: 6vh;
    font-size: 80px;
    color: #19be6b !important;
  }

  .title {
    margin-top: 20px;
    font-size: 30px;
    font-weight: 500;
  }

  .msg {
    margin: 20px auto;
    max-width: 600px;
    font-size: 16px;
    color: #808695;
    line-height: 1.8;
    text-align: left;
    width: auto;
  }

  .res {
    padding: 22px 30px;
    margin-top: 30px;
    text-align: left;
    background-color: #f8f8f9;
    border-radius: 5px;

    p {
      padding: 8px 0;
      font-size: 15px;
      color: #808695;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }

  .btn-group {
    margin-top: 50px;
  }
}

// 暗黑主题适配
.dark {
  .success {
    .res {
      background: #28282a;
    }
  }
}

// 移动端适配
@media screen and (max-width: $device-phone) {
  .success {
    padding: 15px 25px !important;

    .icon {
      margin-top: 4vh;
      font-size: 60px;
    }

    .title {
      margin-top: 10px;
      font-size: 25px;
    }

    .sub-title {
      font-size: 16px;
    }

    .res {
      padding: 10px 30px;
    }
  }
}
</style>
