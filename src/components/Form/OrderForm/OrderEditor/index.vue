<template>
    <div class="edit-card-container">
        <el-form ref="formRef" :model="orderForm" :rules="rules" class="custom-form" label-position="right" style="margin-top: 20px" hide-required-asterisk>
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
                    <el-radio v-for="type in ORDER_ITEM_OPTIONS.teaching_types" :key="type" :value="type">
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
                <el-select v-model="orderForm.subjects" multiple placeholder="请选择补习科目">
                    <el-option v-for="subject in ORDER_ITEM_OPTIONS.subjects" :key="subject" :label="subject" :value="subject" />
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
                            <el-select v-model="orderForm.teacher_type" placeholder="请选择教师类型">
                                <el-option v-for="type in ORDER_ITEM_OPTIONS.teacher_types" :key="type" :label="type"
                                    :value="type" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                        <el-form-item label="性别要求：" prop="teacher_gender">
                            <el-select v-model="orderForm.teacher_gender" placeholder="请选择教师性别">
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
                <el-select v-model="orderForm.order_tags" multiple placeholder="请选择订单标签">
                    <el-option v-for="tag in ORDER_ITEM_OPTIONS.order_tags" :key="tag" :label="tag" :value="tag" />
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
                            <el-select v-model="orderForm.district" placeholder="请选择区域">
                                <el-option v-for="district in ORDER_ITEM_OPTIONS.districts[orderForm.city]" :key="district"
                                    :label="district" :value="district" />
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

            <el-form-item prop="order_source">
                <template #label>
                    <span class="primary-label">订单来源</span>
                    <span class="label-colon">：</span>
                    <span class="label-required"></span>
                </template>
                <el-input v-model="orderForm.order_source" placeholder="请输入订单来源" />
            </el-form-item>

            <slot name="form-actions"></slot>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { TutorOrder } from '@/types/tutorOrder'
import { ORDER_ITEM_OPTIONS } from '@/types/OrderOptions'

// 定义props和emits
const props = defineProps<{
    modelValue: TutorOrder
}>()

const emit = defineEmits(['update:modelValue'])

const formRef = ref<FormInstance>()

// 使用计算属性处理表单数据
const orderForm = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

// 监听城市变化
watch(() => orderForm.value.city, (newCity) => {
    orderForm.value.district = ORDER_ITEM_OPTIONS.districts[newCity][0]
})

// 表单验证规则
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

// 暴露方法给父组件
defineExpose({
    validate: async () => {
        if (!formRef.value) return false
        return await formRef.value.validate()
    },
    resetFields: () => {
        formRef.value?.resetFields()
    }
})
</script>

<style lang="scss" scoped>
@use './style.scss' as *;
</style> 