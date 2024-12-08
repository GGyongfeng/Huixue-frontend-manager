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
        <ColumnSelector @change="$emit('column-change', $event)" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Setting, Refresh } from '@element-plus/icons-vue'
import type { tutorQueryParams } from '@/types/tutorOrder'
import ColumnSelector from '../TableColumnSelector/ColumnSelector.vue'
import { useTutorStore } from '@/store/modules/tutor'
import { storeToRefs } from 'pinia'
import './style.scss'

const emit = defineEmits<{
  (e: 'search', params: Partial<tutorQueryParams>): void
  (e: 'column-change', columns: string[]): void
}>()

const tutorStore = useTutorStore()
const { filterSelections, searchParams } = storeToRefs(tutorStore)

const searchForm = ref<Partial<tutorQueryParams>>({
  keyword: '',
})

const showMobileSearch = ref(false)

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
  console.log('搜索参数:', searchParams)
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

// 在组件挂载时初始化搜索参数
onMounted(() => {
  tutorStore.initSearchParams()
  
  // 恢复表单值
  searchForm.value.keyword = searchParams.value.keyword || ''
  
  // 触发搜索
  emit('search', searchParams.value)
})
</script> 