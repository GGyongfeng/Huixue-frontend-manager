<template>
  <el-dialog
    title="修改状态"
    :modelValue="visible"
    @update:modelValue="emit('update:visible', $event)"
    width="400px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" label-width="80px">
      <el-form-item label="订单状态">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option label="已成交" value="已成交" />
          <el-option label="未成交" value="未成交" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="成交教师" v-if="formData.status === '已成交'">
        <el-input v-model="formData.deal_teacher_id" placeholder="请输入成交教师ID" />
      </el-form-item>
      
      <el-form-item label="成交员工" v-if="formData.status === '已成交'">
        <el-input v-model="formData.deal_staff_id" placeholder="请输入成交员工ID" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { TutorType } from '@/types/tutorOrder'
import { TutorsService } from '@/api/tutors'

const props = defineProps<{
  visible: boolean
  data?: TutorType
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const loading = ref(false)
const formRef = ref()
const formData = reactive<Partial<TutorType>>({
  status: '未成交',
  deal_teacher_id: undefined,
  deal_staff_id: undefined
})

// 监听 props.data 变化，更新表单数据
watch(() => props.data, (newData) => {
  if (newData) {
    Object.assign(formData, {
      status: newData.status,
      deal_teacher_id: newData.deal_teacher_id,
      deal_staff_id: newData.deal_staff_id
    })
  }
}, { immediate: true })

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  if (!props.data?.id) return
  
  loading.value = true
  try {
    await TutorsService.updateTutorStatus(props.data.id, formData.status === '已成交' ? 1 : 0)
    emit('success')
    handleClose()
  } finally {
    loading.value = false
  }
}
</script>
