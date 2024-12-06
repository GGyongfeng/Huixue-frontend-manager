<template>
  <div class="tutor-create">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>创建教师</span>
        </div>
      </template>
      
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入教师姓名"></el-input>
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()

const formData = reactive({
  name: '',
  phone: ''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入教师姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
})

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('提交表单:', formData)
      // TODO: 调用API保存数据
    } else {
      console.error('表单验证失败:', fields)
    }
  })
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
</script>

<style scoped lang="scss">
.tutor-create {
  padding: 20px;
  
  .box-card {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .card-header {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
