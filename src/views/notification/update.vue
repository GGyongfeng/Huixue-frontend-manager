<template>
  <div class="notification-update">
    <a-card title="更新通知">
      <a-form :model="formData" :rules="rules" ref="formRef">
        <!-- <a-form-item label="通知ID" name="id">
          <a-input-number 
            v-model:value="formData.id" 
            placeholder="请输入通知ID"
            :min="1"
          />
        </a-form-item> -->

        <a-form-item label="通知标题" name="title">
          <a-input v-model:value="formData.title" placeholder="请输入通知标题" />
        </a-form-item>
        
        <a-form-item label="通知内容" name="description">
          <a-textarea 
            v-model:value="formData.description" 
            placeholder="请输入通知内容"
            :rows="4" 
          />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSubmit">更新通知</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { updateNotification, getNotificationDetail, getLatestNotification } from '@/api'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

interface NotificationForm {
  id?: number
  title: string
  description: string
}

const formRef = ref<FormInstance>()
const formData = reactive<NotificationForm>({
  title: '',
  description: ''
})

const rules = {
  title: [{ required: true, message: '请输入通知标题' }],
  description: [{ required: true, message: '请输入通知内容' }]
}

const formatDate = (date: Date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const getDetail = async (id: number) => {
  try {
    const res = await getNotificationDetail(id)
    if (res.data) {
      const { title, description } = res.data
      Object.assign(formData, {
        id,
        title,
        description
      })
    }
  } catch (error) {
    console.error('获取通知详情失败:', error)
    message.error('获取通知详情失败')
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    const res = await updateNotification(formData)

    if (res.code === 200) {
      const currentTime = formatDate(new Date())
      const currentUser = userStore.info?.userInfo

      router.push({
        path: '/result/success',
        query: {
          title: '更新成功',
          subTitle: [
            `通知标题：${formData.title}`,
            `更新时间：${currentTime}`,
            `更新人员：${currentUser?.realname}`,
            `通知内容：${formData.description}`
          ].join('\n'),
          extraInfo: '通知更新成功，请返回列表查看',
          backPath: '/notification/update'
        }
      })
    } else {
      message.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('更新通知失败:', error)
    message.error('更新失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  const id = Number(route.query.id)
  if (id) {
    getDetail(id)
  } else {
    // 如果没有 ID 参数，获取最新通知
    getLatestNotification().then(res => {
      if (res.data) {
        const { title, description } = res.data
        Object.assign(formData, {
          title,
          description
        })
      }
    }).catch(error => {
      console.error('获取最新通知失败:', error)
      message.error('获取最新通知失败')
    })
  }
})
</script>

<style scoped>
.notification-update {
  padding: 24px;
}
</style> 