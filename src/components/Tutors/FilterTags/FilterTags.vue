<template>
  <div>
    <div v-if="hasActiveFilters" class="filter-tags">
      <div v-for="(filter, prop) in activeFilters" :key="prop" class="filter-group">
        <span class="filter-label">{{ getColumnLabel(prop) }}:</span>
        <el-tag 
          v-for="value in filter" 
          :key="value" 
          closable 
          @close="handleRemove(prop, value)"
        >
          {{ value }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
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
  const hasFilters = Object.values(filterSelections.value).some(filter => filter.selected.length > 0)
  return hasFilters
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
  const label = props.config.columns.find(col => col.prop === prop)?.label || prop
  return label
}

// 移除筛选条件
const handleRemove = (prop: string, value: string) => {
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
    }
  }
}
</style> 