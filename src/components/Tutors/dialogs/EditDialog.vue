<template>
  <el-dialog
    title="确认编辑"
    :modelValue="visible"
    @update:modelValue="emit('update:visible', $event)"
    width="400px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="confirm-content">
      <p>确定要编辑订单 <span class="order-code">{{ data?.tutor_code }}</span> 吗？</p>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TutorOrder } from '@/types/tutorOrder'
import { useTutorStore } from '@/store/modules/tutor'

const props = defineProps<{
  visible: boolean
  data?: TutorOrder
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const router = useRouter()
const tutorStore = useTutorStore()
const loading = ref(false)

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  if (props.data) {
    // 将当前订单存储到 store
    tutorStore.setCurrentTutor(props.data)
    // 跳转到编辑页面
    router.push('/tutors/edit')
    handleClose()
  }
}
</script>

<style lang="scss" scoped>
.confirm-content {
  padding: 20px 0;
  text-align: center;
  
  .order-code {
    color: var(--el-color-primary);
    font-weight: bold;
  }
}
</style> 