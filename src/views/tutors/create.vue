<template>
  <div class="page-content">
    <div class="header">
      <h3>上传订单</h3>
    </div>

    <el-form ref="formRef" :model="orderForm" :rules="rules" label-width="120px" style="margin-top: 20px">
      <el-form-item prop="tutor_code">
        <template #label>
          <span class="primary-label">订单编号</span>
          <span class="label-colon">：</span>
          <span class="label-required">*</span>
        </template>
        <el-input v-model="orderForm.tutor_code" placeholder="请输入订单编号" />
      </el-form-item>

      <el-form-item prop="student_gender">
        <template #label>
          <span class="primary-label">学生性别</span>
          <span class="label-colon">：</span>
          <span class="label-required">*</span>
        </template>
        <el-radio-group v-model="orderForm.student_gender">
          <el-radio :value="'男'">男</el-radio>
          <el-radio :value="'女'">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="teaching_type">
        <template #label>
          <span class="primary-label">教学类型</span>
          <span class="label-colon">：</span>
          <span class="label-required">*</span>
        </template>
        <el-radio-group v-model="orderForm.teaching_type">
          <el-radio 
            v-for="type in ORDER_ITEM_OPTIONS.teaching_types" 
            :key="type" 
            :value="type"
          >
            {{ type }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="student_grade">
        <template #label>
          <span class="primary-label">学生年级</span>
          <span class="label-colon">：</span>
          <span class="label-required">*</span>
        </template>
        <el-select v-model="orderForm.student_grade" placeholder="请选择年级">
          <el-option v-for="grade in ORDER_ITEM_OPTIONS.student_grades" :key="grade" :label="grade" :value="grade" />
        </el-select>
      </el-form-item>

      <el-form-item prop="subjects">
        <template #label>
          <span class="primary-label">补习科目</span>
          <span class="label-colon">：</span>
          <span class="label-required">*</span>
        </template>
        <el-select 
          v-model="orderForm.subjects" 
          multiple 
          placeholder="请选择补习科目"
        >
          <el-option 
            v-for="subject in ORDER_ITEM_OPTIONS.subjects"
            :key="subject"
            :label="subject"
            :value="subject"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <template #label>
          <span class="primary-label">教师要求</span>
          <span class="label-colon">：</span>
          <span class="label-required"></span>
        </template>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12">
            <el-form-item label="类型要求：" prop="teacher_type">
              <el-select 
                v-model="orderForm.teacher_type" 
                placeholder="请选择教师类型"
              >
                <el-option 
                  v-for="type in ORDER_ITEM_OPTIONS.teacher_types"
                  :key="type"
                  :label="type"
                  :value="type"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="性别要求：" prop="teacher_gender">
              <el-select 
                v-model="orderForm.teacher_gender" 
                placeholder="请选择教师性别"
              >
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
                <el-option label="无" value="无" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item prop="order_tags">
        <template #label>
          <span class="primary-label">订单标签</span>
          <span class="label-colon">：</span>
          <span class="label-required"></span>
        </template>
        <el-select 
          v-model="orderForm.order_tags" 
          multiple 
          placeholder="请选择订单标签"
        >
          <el-option 
            v-for="tag in ORDER_ITEM_OPTIONS.order_tags"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <template #label>
          <span class="primary-label">地址信息</span>
          <span class="label-colon">：</span>
          <span class="label-required">*</span>
        </template>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8">
            <el-form-item label="城市：" prop="city">
              <el-input v-model="orderForm.city" placeholder="请输入城市" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="区域：" prop="district">
              <el-select 
                v-model="orderForm.district" 
                placeholder="请选择区域"
              >
                <el-option 
                  v-for="district in ORDER_ITEM_OPTIONS.districts[orderForm.city]"
                  :key="district"
                  :label="district"
                  :value="district"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="详细地址：" prop="address">
              <el-input v-model="orderForm.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <template #label>
          <span class="primary-label">学生情况</span>
          <span class="label-colon">：</span>
          <span class="label-required"></span>
        </template>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="成绩情况：" prop="grade_score">
              <el-input v-model="orderForm.grade_score" placeholder="请输入成绩情况" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="学生水平：" prop="student_level">
              <el-select v-model="orderForm.student_level" placeholder="请选择学生水平">
                <el-option label="优秀" value="优秀" />
                <el-option label="较好" value="较好" />
                <el-option label="中等" value="中等" />
                <el-option label="不及格" value="不及格" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item prop="tutoring_time">
        <template #label>
          <span class="primary-label">辅导时间</span>
          <span class="label-colon">：</span>
          <span class="label-required">*</span>
        </template>
        <el-input v-model="orderForm.tutoring_time" placeholder="请输入辅导时间" />
      </el-form-item>

      <el-form-item prop="salary">
        <template #label>
          <span class="primary-label">课时费</span>
          <span class="label-colon">：</span>
          <span class="label-required">*</span>
        </template>
        <el-input v-model="orderForm.salary" placeholder="请输入课时费" />
      </el-form-item>

      <el-form-item prop="phone_number">
        <template #label>
          <span class="primary-label">联系电话</span>
          <span class="label-colon">：</span>
          <span class="label-required">*</span>
        </template>
        <el-input v-model="orderForm.phone_number" placeholder="请输入联系电话" />
      </el-form-item>

      <el-form-item prop="requirement_desc">
        <template #label>
          <span class="primary-label">具体要求</span>
          <span class="label-colon">：</span>
          <span class="label-required"></span>
        </template>
        <el-input v-model="orderForm.requirement_desc" type="textarea" :rows="4" placeholder="请输入具体要求" />
      </el-form-item>

      <el-form-item>
        <el-button 
          type="primary" 
          @click="submitForm(formRef)"
          :loading="loading"
        >
          提交
        </el-button>
        <el-button @click="resetForm(formRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { TutorOrder } from '@/types/tutorOrder'
import { ORDER_ITEM_OPTIONS, getDefaultOrderSelection, type City } from '@/config/OrderCreatingConfig'
import { useUserStore } from '@/store/modules/user'
import { mutationApis } from '@/api/tutors/mutation'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const formRef = ref<FormInstance>()

const userStore = useUserStore()
const userCity = (userStore.info.city || '天津') as City

const orderForm = reactive<TutorOrder>({
  ...getDefaultOrderSelection(userCity)
})

watch(() => orderForm.city, (newCity) => {
  orderForm.district = ORDER_ITEM_OPTIONS.districts[newCity][0]
})

const rules = reactive<FormRules>({
  tutor_code: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
  student_gender: [{ required: true, message: '请选择学生性别', trigger: 'change' }],
  teaching_type: [{ required: true, message: '请选择教学类型', trigger: 'change' }],
  student_grade: [{ required: true, message: '请选择学生年级', trigger: 'change' }],
  subjects: [{ required: true, message: '请选择补习科目', trigger: 'change' }],
  district: [{ required: true, message: '请选择区域', trigger: 'change' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  tutoring_time: [{ required: true, message: '请输入辅导时间', trigger: 'blur' }],
  salary: [{ required: true, message: '请输入课时费', trigger: 'blur' }],
  phone_number: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

const router = useRouter()
const loading = ref(false)

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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  try {
    // 表单验证
    await formEl.validate(async (valid) => {
      if (!valid) return
      
      loading.value = true
      
      try {
        // 调用创建API
        const res = await mutationApis.addTutor(orderForm)
        
        if (res.code === 200) {
          ElMessage.success('创建成功')
          
          // 获取当前用户信息
          const currentUser = userStore.info
          const currentTime = formatDate(new Date())
          
          // 跳转到成功页面
          router.push({
            path: '/result/success',
            query: {
              title: '创建成功',
              subTitle: [
                `订单编号：${orderForm.tutor_code}`,
                `创建时间：${currentTime}`,
                `创建人员：${currentUser.name || currentUser.username}`,
                `所在城市：${orderForm.city}${orderForm.district}`,
                `联系电话：${orderForm.phone_number}`
              ].join('\n'),  // 使用换行符连接
              extraInfo: '订单创建成功，请返回列表查看',
              backPath: '/tutors/list'  // 返回列表页
            }
          })
        } else {
          ElMessage.error(res.message || '创建失败')
        }
      } catch (error) {
        console.error('创建订单失败:', error)
        ElMessage.error('创建失败，请稍后重试')
      }
    })
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.page-content {
  width: 100%;
  height: 100%;
  padding: 10px;

  .header {
    padding-bottom: 15px;
    border-bottom: 1px solid var(--art-border-color);

    h3 {
      font-size: 18px;
      font-weight: 500;
    }
  }

  :deep(.el-form) {
    max-width: 1000px;
    margin: 0 auto;

    // 一级标题加粗
    >.el-form-item>.el-form-item__label {
      font-weight: 600;
    }

    // 子标题不加粗
    .el-row .el-form-item__label {
      font-weight: normal;
    }

    // 调整表单项标签行高
    .el-form-item__label {
      height: 32px; // 与 Element Plus 输入框高度一致
      line-height: 32px;
    }

    // 修改 primary-label 样式
    .primary-label {
      display: inline-block;
      width: 70px;
      font-weight: 600;
      text-align: justify;
      text-align-last: justify;
      height: 32px; // 与父元素高度一致
      line-height: 32px; // 与高度一致，实现垂直居中
      vertical-align: middle; // 确保垂直对齐
    }

    .label-colon {
      display: inline-block;
      width: 8px; // 设置固定宽度
      text-align: center;
    }

    .label-required {
      display: inline-block;
      width: 10px; // 设置固定宽度
      color: var(--el-color-danger);
      text-align: center;
    }

    // 移除原有的必填星号样式
    .el-form-item.is-required:not(.is-no-asterisk) {

      .el-form-item__label:before,
      .el-form-item__label:after {
        display: none;
      }
    }

    // 教师要求部分的下拉框宽度 - 仅在非移动端生效
    @media screen and (min-width: $device-phone) {
      .el-row {
        .el-form-item {
          .el-select {
            width: 180px;
          }
        }
      }
    }

    // 移动端样式调整
    @media screen and (max-width: $device-phone) {
      // 调整表单在移动端的 label 宽度
      &.el-form--label-right {
        .el-form-item__label {
          width: 80px !important; // 移动端设置更小的宽度
          padding-right: 0;
        }
      }

      .el-form-item {
        .primary-label {
          width: auto;
          margin-right: 1px;
        }

        .label-colon {
          width: 8px;
        }

        .label-required {
          width: 5px;
          margin-right: 10px;
        }

        // 嵌套的表单项特殊处理
        .el-row {
          .el-form-item {
            .el-form-item__label {
              padding: 0 4px 0 0 !important; // 子表单项的 label 右边距更小
            }
          }
        }
      }

      // 调整 el-col 在移动端的间距
      .el-row {
        .el-col {
          margin-bottom: 15px; // 增加底部间距

          &:last-child {
            margin-bottom: 0; // 最后一个元素不需要底部间距
          }
        }
      }
    }
  }
}
</style>
