<template>
  <el-popover placement="bottom" :width="300" trigger="click">
    <template #reference>
      <el-button type="primary" class="icon-button">
        <el-icon><Setting /></el-icon>
        <span class="button-text">列表设置</span>
      </el-button>
    </template>

    <div class="column-selector">
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
        全选
      </el-checkbox>

      <el-divider />

      <el-checkbox-group v-model="selectedColumns" @change="handleCheckedChange">
        <div v-for="item in columnOptions" :key="item.prop" class="column-item">
          <el-checkbox :value="item.prop">
            {{ item.label }}
            <el-tooltip :content="item.comment" placement="right">
              <el-icon>
                <InfoFilled />
              </el-icon>
            </el-tooltip>
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Setting, InfoFilled } from '@element-plus/icons-vue'
import type { CheckboxValueType } from 'element-plus'
import type { TableColumn } from '@/types/tutorMenuList'
import type { TutorType } from '@/types/tutorOrder'
import { ALL_COLUMNS, DEFAULT_COLUMNS } from '@/types/tutorMenuList'

// 使用所有列配置
const columnOptions = ALL_COLUMNS

// 从 localStorage 获取用户设置，如果没有则使用默认值
const getStoredColumns = (): string[] => {
  const stored = localStorage.getItem('tutorTableColumns')

  if (stored) {
    try {
      const parsedColumns = JSON.parse(stored)
      return parsedColumns
    } catch (e) {
      console.error('解析存储的列配置失败:', e)
    }
  }

  const defaultColumns = DEFAULT_COLUMNS.map(col => col.prop)
  return defaultColumns
}

const selectedColumns = ref<string[]>(getStoredColumns())
const checkAll = ref(false)
const isIndeterminate = ref(true)

// 保存列设置到 localStorage
const saveColumnsToStore = (columns: string[]) => {
  try {
    localStorage.setItem('tutorTableColumns', JSON.stringify(columns))
    console.log('列配置保存成功')

    // 验证保存是否成功
    // const saved = localStorage.getItem('tutorTableColumns')
    // console.log('验证保存的数据:', saved)
  } catch (e) {
    console.error('保存列配置失败:', e)
  }
}

// 全选/取消全选
const handleCheckAllChange = (val: CheckboxValueType) => {
  selectedColumns.value = val ? columnOptions.map(item => item.prop) : []
  isIndeterminate.value = false
  emitChange()
}

// 选择变化
const handleCheckedChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === columnOptions.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < columnOptions.length
  emitChange()
}

const emit = defineEmits<{
  (e: 'change', columns: string[]): void
}>()

// 发送变化事件并保存设置
const emitChange = () => {
  saveColumnsToStore(selectedColumns.value)
  emit('change', selectedColumns.value)
}

// 组件挂载时初始化选中状态
onMounted(() => {
  const columns = getStoredColumns()

  selectedColumns.value = columns
  checkAll.value = columns.length === columnOptions.length
  isIndeterminate.value = columns.length > 0 && columns.length < columnOptions.length
})
</script>

<style lang="scss" scoped>
.icon-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

.column-selector {
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;

  .column-item {
    margin: 8px 0;
    display: flex;
    align-items: center;

    .el-icon {
      margin-left: 4px;
      color: #909399;
      cursor: help;
    }
  }
}
</style>