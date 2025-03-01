<template>
  <div class="column-header">
    {{ label }}
    <!-- 日期范围选择器 -->
    <el-popover
      v-if="column.dateRange"
      placement="bottom"
      trigger="click"
      :width="isMobile ? '94vw' : 420"
      :hide-after="0"
    >
      <template #reference>
        <el-icon class="filter-icon" :class="{ active: dropdownVisible }">
          <ArrowDown />
        </el-icon>
      </template>
      
      <div class="date-picker-container">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          @change="handleDateRangeChange"
          class="date-picker"
        />
      </div>
    </el-popover>

    <!-- 原有的多选筛选 -->
    <el-dropdown v-else-if="column.select?.type === 'multiple'" trigger="click"
      @command="(val) => handleFilter(column.prop, val)">
      <el-icon class="filter-icon">
        <ArrowDown />
      </el-icon>

      <template #dropdown>
        <el-dropdown-menu>
          <!-- 全选选项 -->
          <el-dropdown-item>
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAll">
              全选
            </el-checkbox>
          </el-dropdown-item>

          <el-divider style="margin: 4px 0" />

          <!-- 选项列表 -->
          <el-dropdown-item v-for="option in column.select.options" :key="option">
            <el-checkbox :model-value="selected.includes(option)"
              @update:model-value="(val) => handleOptionChange(val, option)" :label="option">
              {{ option }}
            </el-checkbox>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import type { TableColumn } from '@/types/tutorMenuList'
import type { CheckboxValueType } from 'element-plus'
import { useTutorStore } from '@/store/modules/tutor'
import { storeToRefs } from 'pinia'
import type { DateModelType } from 'element-plus'
import { useWindowSize } from '@vueuse/core'
import { useUserStore } from '@/store/modules/user'
import { ORDER_ITEM_OPTIONS } from '@/types/OrderOptions'
import type { City } from '@/config/cityConfig'
import { CREATED_BY_NAME } from '@/config/cityConfig'

// 日期范围类型
type RangeValue = string[]
const dateRange = ref<RangeValue>([])

const props = defineProps<{
  column: TableColumn
}>()

const tutorStore = useTutorStore()
const { filterSelections } = storeToRefs(tutorStore)

const label = computed(() => props.column.label)
const selected = computed(() => filterSelections.value[props.column.prop]?.selected || [])
const checkAll = computed(() => Boolean(filterSelections.value[props.column.prop]?.checkAll || false))
const isIndeterminate = computed(() => filterSelections.value[props.column.prop]?.isIndeterminate || false)

const handleFilter = (prop: string, value: string) => {
  // emit('filter-change', prop)
}

const handleCheckAll = (val: CheckboxValueType) => {
  const options = props.column.select?.options || []
  tutorStore.updateFilterSelection(props.column.prop, Boolean(val) ? [...options] : [])
  tutorStore.updateFilterCheckAll(props.column.prop, Boolean(val), false)
}

const handleOptionChange = (checked: CheckboxValueType, option: string) => {
  const currentSelected = filterSelections.value[props.column.prop]?.selected || []
  const newSelected = checked 
    ? [...currentSelected, option]
    : currentSelected.filter(item => item !== option)
  
  tutorStore.updateFilterSelection(props.column.prop, newSelected)
  
  // 更新全选和半选状态
  const options = props.column.select?.options || []
  tutorStore.updateFilterCheckAll(
    props.column.prop,
    newSelected.length === options.length,
    newSelected.length > 0 && newSelected.length < options.length
  )
}

// 快捷选项
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  }
]

// 添加下拉框可见性状态
const dropdownVisible = ref(false)

// 处理下拉框可见性变化
const handleDropdownVisibleChange = (visible: boolean) => {
  dropdownVisible.value = visible
  // 如果下拉框关闭且有日期范围，自动应用筛选
  if (!visible && dateRange.value) {
    handleDateRangeChange(dateRange.value)
  }
}

// 修改日期范围变化处理函数
const handleDateRangeChange = (value: string[] | null) => {
  if (!value || !Array.isArray(value)) {
    tutorStore.updateFilterSelection('created_at', [])
    return
  }

  // 直接使用格式化后的字符串
  tutorStore.updateFilterSelection('created_at', value)
  dropdownVisible.value = false
}

// 添加移动端判断
const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 768)

// 初始化时从 store 同步日期范围
onMounted(() => {
  const storedDates = filterSelections.value.created_at?.selected || []
  if (storedDates.length === 2) {
    dateRange.value = storedDates  // 直接使用存储的日期字符串
  }
  
})

// 获取用户城市信息
const userStore = useUserStore()
const userCity = computed(() => (userStore.info?.userInfo?.city || '天津') as City)

// 动态获取 created_by_name 选项
const createdByNameOptions = computed(() => {
  return ORDER_ITEM_OPTIONS.created_by_name[userCity.value as keyof typeof ORDER_ITEM_OPTIONS.created_by_name] || []
})
// 调试信息
console.log('用户城市:', userCity.value)
console.log('创建人选项:', createdByNameOptions.value)
console.log('createdByNameOptions :', createdByNameOptions.value)
</script>

<style lang="scss" scoped>
.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .filter-icon {
    margin-left: 2px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.el-dropdown-menu {
  padding: 8px;
  min-width: 150px;
  max-height: 400px;
  
  :deep(.el-scrollbar__wrap) {
    max-height: 300px;
  }

  .el-dropdown-item {
    padding: 4px 8px;

    &:hover {
      background-color: transparent;
    }
  }
}

:deep(.el-dropdown__popper) {
  max-height: 400px;
  overflow-y: auto;
}

.date-range-picker {
  padding: 8px;
}

// 修改下拉框样式
:deep(.el-dropdown__popper) {
  min-width: 420px !important;
  
  // 防止下拉框被遮挡
  z-index: 2000 !important;
  
  // 添加一些过渡效果
  transition: opacity 0.3s, transform 0.3s !important;
  
  // 确保日期选择器在下拉框内部正确显示
  .el-date-picker {
    box-shadow: none;
    margin: 0;
  }
}

// 添加图标旋转效果
.filter-icon {
  transition: transform 0.3s;
  
  &.active {
    transform: rotate(180deg);
    color: var(--el-color-primary);
  }
}

.date-picker-container {
  padding: 5px;
  width: 100%;

  :deep(.el-range-editor) {
    width: 100% !important;
  }

  :deep(.el-date-picker) {
    width: 100% !important;
    
    // 移动端样式调整
    @media screen and (max-width: 768px) {
      .el-picker-panel__body {
        min-width: unset !important;
        width: 100% !important;
      }
      
      .el-date-range-picker__content {
        float: none !important;
        width: 100% !important;
        margin: 0 !important;
        
        &.is-left {
          border-right: none;
          margin-bottom: 10px;
        }
      }
      
      .el-date-range-picker__header {
        margin-bottom: 5px;
      }
      
      .el-picker-panel__content {
        width: 100% !important;
        margin: 0 !important;
      }
      
      .el-date-table {
        width: 100% !important;
        
        th, td {
          padding: 2px !important;
        }
      }
      
      .el-input__wrapper {
        width: 100% !important;
      }
      
      .el-range-input {
        width: 42% !important;
        font-size: 12px !important;
      }
      
      .el-range-separator {
        width: 16% !important;
        font-size: 12px !important;
      }
    }
  }
}

// 修改弹出层样式
:deep(.el-picker-panel) {
  @media screen and (max-width: 768px) {
    width: 100% !important;
    max-width: 94vw !important;
    margin: 0 auto;
    
    // 修改日期面板布局
    .el-date-range-picker__content {
      &.is-right {
        display: none !important;  // 隐藏右侧面板
      }
      
      &.is-left {
        width: 100% !important;
        border-right: none;
        margin: 0 !important;
      }
    }
    
    // 调整日期表格大小
    .el-date-table {
      width: 100% !important;
      
      th, td {
        padding: 3px !important;
        height: 30px !important;
      }
    }
    
    // 调整头部按钮间距
    .el-picker-panel__icon-btn {
      margin: 0 3px !important;
    }
    
    // 调整时间选择器布局
    .el-date-range-picker__time-header {
      .el-date-range-picker__editors-wrap {
        width: 100% !important;
        
        &.is-right {
          display: none !important;
        }
        
        &.is-left {
          margin-right: 0 !important;
        }
      }
    }
    
    // 调整快捷选项布局
    .el-picker-panel__sidebar {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--el-border-color-light);
      padding: 5px;
      
      .el-picker-panel__shortcut {
        width: auto;
        display: inline-block;
        margin: 2px 5px;
        padding: 2px 5px;
        border: 1px solid var(--el-border-color);
        border-radius: 3px;
      }
    }
    
    .el-picker-panel__body {
      min-width: unset !important;
      width: 100% !important;
    }
  }
}

// 调整日期选择器输入框
:deep(.el-date-editor) {  
  @media screen and (max-width: 768px) {
    width: 100% !important;
    
    .el-range-input {
      font-size: 12px !important;
    }
    
    .el-range-separator {
      padding: 0 3px !important;
    }
  }
}

// 修改 popover 样式
:deep(.el-popper) {
  @media screen and (max-width: 768px) {
    padding: 0 !important;
    max-width: 94vw !important;
  }
}

// 修改图标样式
.filter-icon {
  &.active {
    transform: rotate(180deg);
    color: var(--el-color-primary);
  }
}
</style>