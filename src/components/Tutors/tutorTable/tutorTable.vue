<template>
  <div class="tutor-table">
    <FilterTags :config="config" />

    <el-table v-loading="loading" :data="data" :border="config.border" :stripe="config.stripe" style="width: 100%"
      @selection-change="handleSelectionChange">
      <!-- 多选列 -->
      <el-table-column v-if="multipleSelection" type="selection" width="55" fixed="left" />

      <template v-for="col in config.columns" :key="col.prop">
        <el-table-column :prop="col.prop" :label="col.label" :width="col.width" :fixed="col.fixed">
          <!-- 自定义表头 -->
          <template #header>
            <TableHeader :column="col" />
          </template>

          <!-- 单元格内容 -->
          <template #default="scope">
            <template v-if="col.slot === 'status'">
              <el-tag :type="scope.row.status === '已成交' ? 'success' : 'warning'">
                {{ scope.row.status }}
              </el-tag>
            </template>
            <template v-else-if="col.prop === 'is_visible'">
              <el-tag :type="scope.row.is_visible ? 'success' : 'warning'">
                {{ scope.row.is_visible ? '可见' : '隐藏' }}
              </el-tag>
            </template>
            <template v-else-if="col.slot === 'operation'">
              <el-button link type="primary" @click="handleEdit(scope.row)" class="icon-button"
                :disabled="multipleSelection">
                <!-- 编辑 -->
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>

              <el-button link type="danger"
                @click="multipleSelection ? handleBatchDelete(selectedRows) : handleDelete(scope.row)"
                class="icon-button">
                <!-- 删除按钮 -->
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>

              <el-button link :type="scope.row.is_visible ? 'info' : 'warning'"
                @click="multipleSelection ? handleBatchVisibility(selectedRows) : handleVisibility(scope.row)"
                class="icon-button">
                <!-- 显示/隐藏 -->
                <el-icon>
                  <View v-if="scope.row.is_visible" />
                  <Hide v-else />
                </el-icon>
              </el-button>

              <el-button link :type="scope.row.status === '已成交' ? 'success' : 'info'"
                @click="multipleSelection ? handleBatchStatus(selectedRows) : handleStatus(scope.row)"
                class="icon-button">
                <!-- 成交/未成交 -->
                <el-icon>
                  <Select v-if="scope.row.status === '已成交'" />
                  <CircleCheck v-else />
                </el-icon>
              </el-button>

              <!-- 复制 -->
              <el-button link type="info" @click="handleCopy(scope.row)" class="icon-button">
                <el-icon>
                  <CopyDocument />
                </el-icon>
              </el-button>
            </template>
            <template v-else-if="col.formatter">
              {{ col.formatter(scope.row) }}
            </template>
            <template v-else>
              {{ scope.row[col.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination" v-if="config.showPagination">
      <el-pagination v-model:current-page="currentPage" :total="total" :page-size="config.pageSize"
        @current-change="handlePageChange" />
    </div>

    <!-- 添加调试信息 -->
    <div v-if="false" style="margin-bottom: 10px; color: #666;">
      当前显示列: {{ config.columns.map(col => col.prop).join(', ') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { TutorOrder } from '@/types/tutorOrder'
import { getDefaultTableConfig, getAllColumns, type TableConfig } from '@/types/tutorMenuList'
import { Delete, Edit, View, Hide, Select, CircleCheck, CopyDocument } from '@element-plus/icons-vue'
import FilterTags from '../FilterTags/FilterTags.vue'
import TableHeader from './TableHeader.vue'
import { useTutorStore } from '@/store/modules/tutor'
import { copyOrderAsText } from '@/utils/orderFormatter'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import type { City } from '@/config/cityConfig'
import ColumnSelector from '../TableColumnSelector/ColumnSelector.vue'
import { DEFAULT_COLUMNS, ALL_COLUMNS } from '@/types/tutorMenuList'

// Props 定义
const props = defineProps<{
  loading: boolean
  data: TutorOrder[]
  total: number
  config: TableConfig  // 必传
  multipleSelection?: boolean
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'edit', row: TutorOrder): void
  (e: 'delete', row: TutorOrder): void
  (e: 'visibility-change', row: TutorOrder): void
  (e: 'status-change', row: TutorOrder): void
  (e: 'batch-delete', rows: TutorOrder[]): void
  (e: 'batch-visibility', rows: TutorOrder[]): void
  (e: 'batch-status', rows: TutorOrder[]): void
}>()

const currentPage = ref(1)

const userStore = useUserStore()
const userCity = computed(() => (userStore.info?.userInfo?.city || '天津') as City)

// 确保 config 始终有值
const config = computed((): TableConfig => {
  return props.config || getDefaultTableConfig(userCity.value)
})

// 计算可见的列
const visibleColumns = computed(() => {
  return config.value.columns.filter(col => col.visible)
})

// 事件处理
const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handleEdit = (row: TutorOrder) => {
  emit('edit', row)
}

const handleDelete = (row: TutorOrder) => {
  emit('delete', row)
}

const handleVisibility = (row: TutorOrder) => {
  emit('visibility-change', row)
}

const handleStatus = (row: TutorOrder) => {
  emit('status-change', row)
}

const tutorStore = useTutorStore()

// 在组件挂载时初始化筛选条件
onMounted(() => {
  console.log('tutorTable mounted, 初始化筛选条件')  // 添加日志
  console.log('当前城市:', userCity.value)  // 添加日志
  console.log('表格配置:', config.value)  // 添加日志
  tutorStore.initFilterSelections(getAllColumns(userCity.value))
})

// 选中的
const selectedRows = ref<TutorOrder[]>([])

// 选择变化处理
const handleSelectionChange = (rows: TutorOrder[]) => {
  selectedRows.value = rows
}

// 批量操作处理
const handleBatchDelete = (rows: TutorOrder[]) => {
  emit('batch-delete', rows)
}

const handleBatchVisibility = (rows: TutorOrder[]) => {
  emit('batch-visibility', rows)
}

const handleBatchStatus = (rows: TutorOrder[]) => {
  emit('batch-status', rows)
}

// 添加复制处理函数
const handleCopy = async (row: TutorOrder) => {
  try {
    await copyOrderAsText(row.id!)
    ElMessage.success('复制成功')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败')
  }
}

const selectedColumns = ref(DEFAULT_COLUMNS.map(col => col.prop))

// 监听选中列的变化
watch(selectedColumns, (newColumns) => {
  console.log('选中的列发生变化:', newColumns)
}, { deep: true })

// 监听配置变化
watch(() => props.config, (newConfig) => {
  console.log('tutorTable.vue - 表格配置更新:', {
    配置: newConfig,
    列数: newConfig.columns.length,
    列: newConfig.columns.map(col => col.prop)
  })
}, { deep: true })
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.tutor-table {
  padding: 0px; // 默认间距

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .icon-button {
    margin: 0 2px;
  }

  // 移动端样式
  @media screen and (max-width: vars.$device-phone) {
    padding: 0px; // 减小移动端的左右间距

    // 调整表格在移动端的显示
    :deep(.el-table) {
      // 可以根据需要添加其他移动端表格样式
      font-size: 12px; // 减小字体大小

      .el-button {
        padding: 2px; // 减小按钮内边距
      }
    }

    .pagination {
      margin-top: 10px; // 减小分页器上边距
    }
  }

  .batch-operations {
    display: flex;
    gap: 8px;

    .icon-button {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }
}
</style>