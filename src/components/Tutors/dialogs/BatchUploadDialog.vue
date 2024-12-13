<template>
    <el-dialog
        v-model="dialogVisible"
        title="批量上传订单"
        width="500px"
    >
        <el-input
            v-model="inputText"
            type="textarea"
            :rows="10"
            placeholder="请粘贴订单文本..."
        />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm', text: string): void
}>()

const dialogVisible = ref(props.modelValue)
const inputText = ref('')

watch(() => props.modelValue, (val) => {
    dialogVisible.value = val
})

watch(() => dialogVisible.value, (val) => {
    emit('update:modelValue', val)
    if (!val) {
        inputText.value = ''
    }
})

const handleConfirm = () => {
    if (!inputText.value.trim()) {
        ElMessage.warning('请输入订单文本')
        return
    }
    emit('confirm', inputText.value.trim())
    dialogVisible.value = false
}
</script> 