<template>
  <el-dialog
    title="新增订单"
    :modelValue="visible"
    @update:modelValue="emit('update:visible', $event)"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 表单内容 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <!-- 表单项将在后续添加 -->
    </el-form>

    <!-- 底部按钮 -->
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
import type { FormRules } from 'element-plus'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const loading = ref(false)
const formRef = ref()
const formData = reactive<Partial<TutorType>>({})

// 添加表单验证规则
const rules = reactive<FormRules>({
  tutor_code: [
    { required: true, message: '请输入订单编号', trigger: 'blur' }
  ],
  student_gender: [
    { required: true, message: '请选择学生性别', trigger: 'change' }
  ],
  teaching_type: [
    { required: true, message: '请选择教学类型', trigger: 'change' }
  ],
  student_grade: [
    { required: true, message: '请选择学生年级', trigger: 'change' }
  ],
  subjects: [
    { required: true, message: '请选择补习科目', trigger: 'change' }
  ],
  district: [
    { required: true, message: '请选择区域', trigger: 'change' }
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ],
  tutoring_time: [
    { required: true, message: '请输入辅导时间', trigger: 'blur' }
  ],
  salary: [
    { required: true, message: '请输入课时费', trigger: 'blur' }
  ]
})

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  // 提交逻辑将在后续添加
}
</script> 