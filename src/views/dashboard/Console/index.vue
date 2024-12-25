<template>
  <div class="console">
    <CardList></CardList>

    <div class="column column2">
      <!-- <ActiveUser></ActiveUser> -->
      <SalesOverview></SalesOverview>
    </div>

    <!-- <div class="column column3">
      <NewUser></NewUser>
      <Dynamic></Dynamic>
      <TodoList></TodoList>
    </div> -->

    <div class="bottom-wrap console-box">
      <div>
        <h2 class="custom-text box-title">关于项目</h2>
        <p>{{ cityConfig.description }}</p>
        <p>使用 Vue3、TypeScript、Vite、Element Plus 等前沿技术搭建</p>

        <div class="button-wrap">
          <div class="btn" @click="goPage('teacher')">
            <span>老师端</span>
            <i class="iconfont">&#xe7e7;</i>
          </div>
          <div class="btn" @click="goPage('/#/notification/update')">
            <span>更新通知</span>
            <i class="iconfont">&#xe7e7;</i>
          </div>
          <div class="btn" @click="goPage('/#/tutors/create')">
            <span>上传订单</span>
            <i class="iconfont">&#xe7e7;</i>
          </div>
          <div class="btn" @click="goPage('/#/tutors/list')">
            <span>订单列表</span>
            <i class="iconfont">&#xe7e7;</i>
          </div>
        </div>
      </div>
      <img class="right-img" src="@imgs/draw/draw1.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CardList from './widget/CardList.vue'
import SalesOverview from './widget/SalesOverview.vue'
import { useUserStore } from '@/store/modules/user'
import { useSettingStore } from '@/store/modules/setting'
import { getCityConfig, type City } from '@/config/cityConfig'

const settingStore = useSettingStore()
const userStore = useUserStore()

// 获取用户城市
const userCity = computed(() => {
  const city = userStore.info?.userInfo?.city || '天津'
  return city as City
})

// 获取当前城市的配置
const cityConfig = computed(() => getCityConfig(userCity.value))


// 获取当前环境的基础URL
const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin

const goPage = (path: string) => {
  // 如果是老师端链接，使用城市配置中的URL
  if (path.includes('teacher')) {
    window.open(cityConfig.value.teacherUrl)
    return
  }
  // 其他链接使用基础URL
  const url = `${baseUrl}${path}`
  window.open(url)
}
</script>

<style lang="scss" scoped>
.console {
  padding-bottom: 15px;

  :deep(.card-header) {
    display: flex;
    justify-content: space-between;
    padding: 20px 25px 5px 0;

    .title {
      h4 {
        font-size: 18px;
        font-weight: 500;
        color: var(--art-text-gray-800);
      }

      p {
        margin-top: 3px;
        font-size: 13px;

        span {
          margin-left: 10px;
          color: #52c41a;
        }
      }
    }
  }

  // 主标题
  :deep(.box-title) {
    color: var(--art-gray-900) !important;
  }

  // 副标题
  :deep(.subtitle) {
    color: var(--art-gray-600) !important;
  }

  .region,
  .dynamic {
    background: var(--art-main-bg-color);
    border-radius: 16px;
  }

  .column {
    display: flex;
    justify-content: space-between;
    margin-top: var(--console-margin);
    background-color: transparent !important;
  }

  .bottom-wrap {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 300px;
    padding: 20px;
    margin-top: var(--console-margin);
    background: var(--art-main-bg-color);
    border-radius: 12px;

    h2 {
      margin-top: 10px;
      font-size: 20px;
      font-weight: 500;
    }

    p {
      margin-top: 5px;
      font-size: 14px;
      color: var(--art-gray-600);
    }

    .button-wrap {
      display: flex;
      flex-wrap: wrap;
      width: 600px;
      margin-top: 35px;

      .btn {
        display: flex;
        justify-content: space-between;
        width: 240px;
        height: 50px;
        padding: 0 15px;
        margin: 0 15px 15px 0;
        font-size: 14px;
        line-height: 50px;
        color: var(--art-gray-800);
        text-align: center;
        cursor: pointer;
        background: var(--art-bg-color);
        border: 1px solid rgba(var(--art-gray-300-rgb), 0.9) !important;
        border-radius: 5px;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 5px 10px rgb(0 0 0 / 5%);
          transform: translateY(-4px);
        }
      }
    }
  }
}
</style>

<!-- 移动端处理 -->
<style lang="scss" scoped>
.console {
  @media screen and (max-width: $device-ipad-pro) {
    .column2 {
      margin-top: 15px;

      :deep(.active-user) {
        width: 50%;
      }

      :deep(.sales-overview) {
        width: calc(50% - 15px);
      }
    }

    .column3 {
      display: flex;
      flex-wrap: wrap;
      margin-top: 15px;

      :deep(.new-user) {
        width: 100%;
        margin-top: 0;
      }

      :deep(.dynamic) {
        flex: 1;
        margin: 15px 0 0;
      }

      :deep(.todo-list) {
        flex: 1;
        margin: 15px 0 0 15px;
      }
    }

    .bottom-wrap {
      height: auto;
      margin-top: 15px;

      .button-wrap {
        width: 470px;
        margin-top: 20px;

        .btn {
          width: 180px;
        }
      }

      .right-img {
        width: 300px;
        height: 230px;
      }
    }
  }

  @media screen and (max-width: $device-ipad-vertical) {
    :deep(.card) {
      width: calc(100% + 15px);
      margin-left: -15px;

      li {
        width: calc(50% - 15px);
        margin: 0 0 15px 15px;
      }
    }

    .column2 {
      display: block;
      margin-top: 0;

      :deep(.active-user) {
        width: 100%;
      }

      :deep(.sales-overview) {
        width: 100%;
        margin-top: 15px;
      }
    }

    .column3 {
      display: block;
      margin-top: 15px;

      :deep(.new-user) {
        width: 100%;
        margin-top: 15px;
      }

      :deep(.dynamic) {
        width: 100%;
        margin: 15px 0 0;
      }

      :deep(.todo-list) {
        width: 100%;
        margin: 15px 0 0;
      }
    }

    .bottom-wrap {
      height: auto;
      margin-top: 15px;

      .button-wrap {
        width: 100%;
        margin-top: 20px;

        .btn {
          width: 190px;
          height: 50px;
          line-height: 50px;
        }
      }

      .right-img {
        display: none;
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    :deep(.card) {
      width: 100%;
      margin: 0;

      li {
        width: 100%;
        margin: 0 0 15px;
      }
    }

    :deep(.active-user) {
      .chart {
        padding: 10px;
      }
    }

    .sales-overview {
      height: 300px;
      padding: 20px 15px;

      :deep(.card-header) {
        padding: 0 0 0 5px !important;
      }
    }

    .bottom-wrap {
      padding: 0 15px;

      .button-wrap {
        width: 100%;
        margin-top: 20px;

        .btn {
          width: 100%;
          margin-right: 0;
        }
      }
    }
  }
}
</style>
