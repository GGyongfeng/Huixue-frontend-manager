<template>
  <div class="tutor-table">
    <FilterTags :config="config" />

    <el-table v-loading="loading" :data="data" :border="config.border" :stripe="config.stripe" style="width: 100%"
      @selection-change="handleSelectionChange">
      <!-- 多选列 -->
      <el-table-column v-if="multipleSelection" type="selection" width="55" fixed="left" />

      <template v-for="col in visibleColumns" :key="col.prop">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TutorOrder } from '@/types/tutorOrder'
import { DEFAULT_TABLE_CONFIG, ALL_COLUMNS, type TableConfig } from '@/types/tutorMenuList'
import { Delete, Edit, View, Hide, Select, CircleCheck, CopyDocument } from '@element-plus/icons-vue'
import FilterTags from '../FilterTags/FilterTags.vue'
import TableHeader from './TableHeader.vue'
import { useTutorStore } from '@/store/modules/tutor'
import { copyOrderAsText } from '@/utils/orderFormatter'
import { ElMessage } from 'element-plus'

// Props 定义
const props = defineProps<{
  loading: boolean
  data: TutorOrder[]
  total: number
  config?: TableConfig
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

const config = computed(() => {
  const finalConfig = props.config || DEFAULT_TABLE_CONFIG
  return finalConfig
})

// 计算可见的列
const visibleColumns = computed(() => {
  const visible = config.value.columns.filter(col => col.visible)
  return visible
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
  // console.log('tutorTable - 初始化', {
  //   显示列数: visibleColumns.value.length,
  //   所有列数: ALL_COLUMNS.length
  // })
  tutorStore.initFilterSelections(ALL_COLUMNS)
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