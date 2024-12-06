<template>
  <div class="tutor-edit">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>编辑教师</span>
        </div>
      </template>
      
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px" v-loading="loading">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入教师姓名"></el-input>
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

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

// 加载教师数据
const loadTutorData = async () => {
  const id = route.params.id
  if (!id) return
  
  loading.value = true
  try {
    // TODO: 调用API获取教师数据
    // const res = await getTutorById(id)
    // Object.assign(formData, res.data)
    
    // 模拟数据
    setTimeout(() => {
      Object.assign(formData, {
        name: '测试教师',
        phone: '13800138000'
      })
      loading.value = false
    }, 500)
  } catch (error) {
    ElMessage.error('加载数据失败')
    loading.value = false
  }
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('提交表单:', formData)
      // TODO: 调用API更新数据
      ElMessage.success('保存成功')
      goBack()
    } else {
      console.error('表单验证失败:', fields)
    }
  })
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadTutorData()
})
</script>

<style scoped lang="scss">
.tutor-edit {
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
