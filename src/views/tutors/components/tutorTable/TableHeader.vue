<template>
  <div class="column-header">
    {{ label }}
    <!-- 如果列有select配置且type为multiple，显示筛选图标 -->
    <el-dropdown v-if="column.select?.type === 'multiple'" trigger="click"
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
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import type { TableColumn } from '@/types/tutorMenuList'
import type { CheckboxValueType } from 'element-plus'
import { useTutorStore } from '@/store/modules/tutor'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  column: TableColumn
}>()

const tutorStore = useTutorStore()
const { filterSelections } = storeToRefs(tutorStore)

const label = computed(() => props.column.label)
const selected = computed(() => filterSelections.value[props.column.prop]?.selected || [])
const checkAll = computed(() => filterSelections.value[props.column.prop]?.checkAll || false)
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

  .el-dropdown-item {
    padding: 4px 8px;

    &:hover {
      background-color: transparent;
    }
  }
}
</style>