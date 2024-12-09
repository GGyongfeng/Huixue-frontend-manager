<template>
  <div class="page-content">
    <div class="header">
      <h3>编辑订单</h3>
    </div>

    <!-- 订单号输入框，仅在直接访问时显示 -->
    <div v-if="showIdInput" class="order-id-input">
      <el-form :inline="true">
        <el-form-item label="订单编号">
          <el-input v-model="orderId" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchOrderDetail" :loading="loading">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 订单编辑表单 -->
    <OrderEditCard
      v-if="orderForm"
      v-model="orderForm"
      ref="orderEditCardRef"
    >
      <template #form-actions>
        <el-form-item class="form-actions">
          <el-button @click="resetForm">重置</el-button>
          <el-button
            type="primary"
            @click="submitForm"
            :loading="loading"
          >
            保存
          </el-button>
        </el-form-item>
      </template>
    </OrderEditCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import OrderEditCard from '@/components/Form/OrderForm/OrderEditor/index.vue'
import type { TutorOrder } from '@/types/tutorOrder'
import { useTutorStore } from '@/store/modules/tutor'
import { queryApis } from '@/api/tutors/query'
import { mutationApis } from '@/api/tutors/mutation'

const route = useRoute()
const router = useRouter()
const tutorStore = useTutorStore()
const loading = ref(false)
const orderEditCardRef = ref()

// 表单数据
const orderForm = ref<TutorOrder | null>(null)
const orderId = ref('')

// 是否显示订单号输入框
const showIdInput = ref(false)

// 数据转换函数
const transformOrderData = (data: TutorOrder) => {
  return {
    ...data,
    subjects: Array.isArray(data.subjects) ? data.subjects : [data.subjects],
    order_tags: Array.isArray(data.order_tags) ? data.order_tags : [data.order_tags]
  }
}

// 获取订单详情
const fetchOrderDetail = async () => {
  if (!orderId.value) {
    ElMessage.warning('请输入订单编号')
    return
  }

  // 验证订单号不包含中文
  const hasChinese = /[\u4e00-\u9fa5]/.test(orderId.value)
  if (hasChinese) {
    ElMessage.warning('订单编号不能包含中文')
    return
  }

  try {
    loading.value = true
    const res = await queryApis.getTutorDetail(orderId.value)
    if (res.code === 200 && res.data) {
      orderForm.value = transformOrderData(res.data)
    } else {
      ElMessage.error(res.message || '获取订单详情失败')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const submitForm = async () => {
  if (!orderForm.value) {
    ElMessage.warning('表单数据不能为空')
    return
  }

  try {
    const valid = await orderEditCardRef.value?.validate()
    if (!valid) return

    loading.value = true
    
    // 打印表单数据到控制台
    console.log('提交的表单数据:', orderForm.value)
    
    // 模拟成功响应
    ElMessage.success('更新成功（测试）')
    router.push('/tutors/list')
    
  } catch (error) {
    console.error('更新订单失败:', error)
    ElMessage.error('更新失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (tutorStore.currentTutor) {
    orderForm.value = transformOrderData(tutorStore.currentTutor)
  } else {
    fetchOrderDetail()
  }
  orderEditCardRef.value?.resetFields()
}

// 初始化
onMounted(() => {
  // 如果store中有当前选中的订单，直接使用
  if (tutorStore.currentTutor) {
    orderForm.value = transformOrderData(tutorStore.currentTutor)
    showIdInput.value = false
  } else {
    // 否则显示订单号输入框
    showIdInput.value = true
  }
})
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  height: 100%;
  padding: 10px;

  .header {
    display: flex;
    align-items: center;
    padding-bottom: 15px;

    h3 {
      font-size: 18px;
      font-weight: 500;
      margin-right: 20px;
      white-space: nowrap;
    }
  }

  .order-id-input {
    margin-bottom: 20px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;

    :deep(.el-form-item__content) {
      justify-content: flex-end;
      margin-left: 0 !important;
    }
  }
}
</style>

