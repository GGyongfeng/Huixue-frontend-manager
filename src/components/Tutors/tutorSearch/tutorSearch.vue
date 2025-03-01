<template>
  <div class="tutor-search">
    <!-- 搜索表单 -->
    <el-form :model="searchForm" class="search-form">
      <el-form-item label="关键词">
        <el-input v-model="searchForm.keyword" placeholder="请输入关键词" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="icon-button" @click="handleSearch">
          <el-icon><Search /></el-icon>
          <span class="button-text">搜索</span>
        </el-button>
        <el-button class="icon-button" @click="handleReset">
          <el-icon><Refresh /></el-icon>
          <span class="button-text">重置</span>
        </el-button>
        <el-button 
          :type="multipleSelection ? 'primary' : 'default'"
          class="icon-button" 
          @click="toggleMultipleSelection"
        >
          <el-icon><Select /></el-icon>
          <span class="button-text">{{ multipleSelection ? '退出多选' : '批量操作' }}</span>
        </el-button>

        <el-button type="primary" @click="showBatchSearchDialog = true">批量搜索</el-button>
        <ColumnSelector @change="$emit('column-change', $event)" />
      </el-form-item>
    </el-form>
    <el-dialog v-model="showBatchSearchDialog" title="批量搜索" width="30%">
    <el-input
      type="textarea"
      v-model="batchSearchInput"
      placeholder="请输入订单编号，以换行、逗号或空格分隔"
      :rows="10"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="showBatchSearchDialog = false">取消</el-button>
      <el-button type="primary" @click="handleBatchSearch">确定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Setting, Refresh, Select } from '@element-plus/icons-vue'
import type { tutorQueryParams } from '@/types/tutorOrder'
import ColumnSelector from '../TableColumnSelector/ColumnSelector.vue'
import { useTutorStore } from '@/store/modules/tutor'
import { storeToRefs } from 'pinia'
import './style.scss'
import { queryApis } from '@/api/tutors/query'  // 导入API


const emit = defineEmits<{
  (e: 'search', params: Partial<tutorQueryParams>): void
  (e: 'column-change', columns: string[]): void
  (e: 'multiple-selection-change', enabled: boolean): void
  (e: 'update:searchResults', data: any): void  // 添加新的事件类型
}>()

const tutorStore = useTutorStore()
const { filterSelections, searchParams } = storeToRefs(tutorStore)

const searchForm = ref<Partial<tutorQueryParams>>({
  keyword: '',
})

const showMobileSearch = ref(false)

const multipleSelection = ref(false)

const toggleMultipleSelection = () => {
  multipleSelection.value = !multipleSelection.value
  emit('multiple-selection-change', multipleSelection.value)
}

const handleSearch = () => {
  const params = { ...searchForm.value }
  const filters: Record<string, string[]> = {}
  Object.entries(filterSelections.value).forEach(([prop, filter]) => {
    if (filter.selected.length > 0) {
      filters[prop] = filter.selected
    }
  })
  
  const searchParams = {
    ...params,
    page: 1,
    pageSize: 20,
    filters
  }
  
  tutorStore.updateSearchParams(searchParams)
  console.log('tutorSearch.vue-搜索参数:', searchParams)
  emit('search', searchParams)
}

const handleReset = () => {
  searchForm.value = {
    keyword: '',
  }
  tutorStore.clearFilterSelections()
  tutorStore.resetSearchParams()
  
  emit('search', {
    page: 1,
    pageSize: 20
  })
}

const handleMobileSearch = () => {
  handleSearch()
  showMobileSearch.value = false
}

const handleMobileReset = () => {
  handleReset()
  showMobileSearch.value = false
}


const showBatchSearchDialog = ref(false)
const batchSearchInput = ref('')

const handleBatchSearch = async () => {
  const orderNumbers = batchSearchInput.value.split(/\s+|,|\n/).filter(Boolean)
  console.log('tutorSearch.vue-批量搜索订单编号:', orderNumbers)
  try {
    const result = await queryApis.getTutorDetailsBatch(orderNumbers)
    console.log('tutorSearch.vue-批量搜索结果:', result)
    if (result.code === 200) {
      // 将结果传递给父组件
      emit('update:searchResults', result.data)
      // 显示成功信息
      console.log(result.message)
    } else {
      // 显示错误信息
      console.error('tutorSearch.vue-批量搜索失败:', result.message)
    }
  } catch (error) {
    console.error('tutorSearch.vue-批量搜索失败:', error)
  }
  showBatchSearchDialog.value = false
}

// 在组件挂载时初始化搜索参数
onMounted(() => {
  tutorStore.initSearchParams()
  
  // 恢复表单值
  searchForm.value.keyword = searchParams.value.keyword || ''
  
  // 触发搜索
  emit('search', searchParams.value)
})
</script>