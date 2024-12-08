<template>
  <el-dialog
    title="删除确认"
    :modelValue="visible"
    @update:modelValue="emit('update:visible', $event)"
    width="400px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="delete-content">
      确定要删除这条订单吗？此操作不可恢复。
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="danger" :loading="loading" @click="handleConfirm">确定删除</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TutorsService } from '@/api/tutors'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  visible: boolean
  id?: number
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const loading = ref(false)

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = async () => {
  if (!props.id) return
  loading.value = true
  try {
    await TutorsService.deleteTutor(props.id)
    ElMessage.success('删除成功')
    emit('success')
    emit('update:visible', false)
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.delete-content {
  padding: 20px 0;
  text-align: center;
}
</style> 