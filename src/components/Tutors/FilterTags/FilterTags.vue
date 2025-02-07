<template>
  <div>
    <div v-if="hasActiveFilters" class="filter-tags">
      <div v-for="(filter, prop) in activeFilters" :key="prop" class="filter-group">
        <span class="filter-label">{{ getColumnLabel(prop) }}:</span>
        <!-- 日期范围标签 -->
        <template v-if="prop === 'created_at'">
          <el-tag 
            closable 
            @close="handleRemove(prop, filter[0])"
            class="date-range-tag"
          >
            {{ formatDateRange(filter) }}
          </el-tag>
        </template>
        <!-- 其他标签 -->
        <template v-else>
          <el-tag 
            v-for="value in filter" 
            :key="value" 
            closable 
            @close="handleRemove(prop, value)"
          >
            {{ value }}
          </el-tag>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TableConfig } from '@/types/tutorMenuList'
import { useTutorStore } from '@/store/modules/tutor'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  config: TableConfig
}>()

const tutorStore = useTutorStore()
const { filterSelections } = storeToRefs(tutorStore)

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return Object.entries(filterSelections.value).some(([_, filter]) => filter.selected.length > 0)
})

// 获取当前激活的筛选条件
const activeFilters = computed(() => {
  const result: Record<string, string[]> = {}
  Object.entries(filterSelections.value).forEach(([prop, filter]) => {
    if (filter.selected.length > 0) {
      result[prop] = filter.selected
    }
  })
  return result
})

// 获取列标签
const getColumnLabel = (prop: string) => {
  const column = props.config.columns.find(col => col.prop === prop)
  return column?.label || prop
}

// 移除筛选条件
const handleRemove = (prop: string, value: string) => {
  // 如果是日期范围，清除整个日期范围
  if (prop === 'created_at') {
    tutorStore.updateFilterSelection(prop, [])
    return
  }

  // 其他筛选条件的处理
  const currentSelected = filterSelections.value[prop].selected
  const newSelected = currentSelected.filter(item => item !== value)
  
  tutorStore.updateFilterSelection(prop, newSelected)
  
  const options = props.config.columns.find(col => col.prop === prop)?.select?.options || []
  tutorStore.updateFilterCheckAll(
    prop,
    newSelected.length === options.length,
    newSelected.length > 0 && newSelected.length < options.length
  )
}

// 格式化日期范围
const formatDateRange = (range: string[]) => {
  if (!range || range.length !== 2) return ''
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
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

  return `${formatDate(range[0])} 至 ${formatDate(range[1])}`
}
</script>

<style lang="scss" scoped>
.filter-tags {
  margin-bottom: 16px;
  
  .filter-group {
    display: inline-flex;
    align-items: center;
    margin-right: 16px;
    margin-bottom: 8px;
    
    .filter-label {
      margin-right: 8px;
      color: var(--el-text-color-secondary);
    }
    
    .el-tag {
      margin-right: 4px;
      
      &.date-range-tag {
        max-width: 400px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style> 