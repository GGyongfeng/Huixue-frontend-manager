<template>
    <div class="tutor-list">
        <div class="table-header">
            <TutorSearch 
              @search="handleSearch" 
              @column-change="handleColumnsChange"
              @multiple-selection-change="handleMultipleSelectionChange"
            />
        </div>
        <div v-loading="loading">
            <TutorTable 
              :loading="loading" 
              :data="tutorList" 
              :total="total" 
              :config="tableConfig"
              :multiple-selection="multipleSelection"
              @page-change="handlePageChange" 
              @edit="handleEdit" 
              @delete="handleDelete" 
              @visibility-change="handleVisibilityChange" 
              @status-change="handleStatusChange"
              @batch-delete="handleBatchDelete"
              @batch-visibility="handleBatchVisibility"
              @batch-status="handleBatchStatus"
            />
        </div>
        <CreateDialog v-model:visible="createVisible" @success="handleSuccess" />
        <EditDialog 
          v-model:visible="editVisible" 
          :data="currentTutor" 
          @success="handleSuccess" 
        />
        <DeleteDialog 
          v-model:visible="deleteVisible" 
          :id="currentId" 
          @success="handleSuccess" 
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onActivated, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTutorStore } from '@/store/modules/tutor'
import { useUserStore } from '@/store/modules/user'
import TutorSearch from '@/components/Tutors/tutorSearch/tutorSearch.vue'
import TutorTable from '@/components/Tutors/tutorTable/tutorTable.vue'
import type { tutorQueryParams, TutorOrder, TutorResponse } from '@/types/tutorOrder'
import { TutorsService } from '@/api/tutors'
import { CreateDialog, EditDialog, DeleteDialog } from '@/components/Tutors/dialogs'
import { getDefaultTableConfig, getAllColumns, type TableConfig, type TableColumn } from '@/types/tutorMenuList'
import { ElMessageBox, ElMessage } from 'element-plus'
import { mutationApis } from '@/api/tutors/mutation'
import { refreshTutorList } from '@/utils/tutorUtils'
import type { City } from '@/config/cityConfig'

const router = useRouter()

// 使用 store
const tutorStore = useTutorStore()
const userStore = useUserStore()
const userCity = computed(() => (userStore.info?.userInfo?.city || '天津') as City)

// 响应式数据
const loading = ref(false)
const tutorList = ref<TutorOrder[]>([])
const total = ref(0)
const queryParams = ref<tutorQueryParams>({
    page: 1,
    pageSize: 20
})

// 弹窗控制
const createVisible = ref(false)
const editVisible = ref(false)
const deleteVisible = ref(false)
const currentTutor = ref<TutorOrder | undefined>(undefined)
const currentId = ref<number>()

// 获取表格配置
const tableConfig = ref<TableConfig>(getDefaultTableConfig(userCity.value))

// 监听 store 中配置的变化
watch(() => tutorStore.tableConfig, (newConfig) => {
  tableConfig.value = newConfig
}, { deep: true })

// 监听城市变化
watch(userCity, (newCity) => {
  const stored = localStorage.getItem('tutorTableColumns')
  if (!stored) {
    tableConfig.value = getDefaultTableConfig(newCity)
  }
})

// 多选状态
const multipleSelection = ref(false)

// 处理多选状态变化
const handleMultipleSelectionChange = (enabled: boolean) => {
    multipleSelection.value = enabled
}

// 批量删除处理
const handleBatchDelete = async (rows: TutorOrder[]) => {
    try {
        const confirmResult = await ElMessageBox.confirm(
            `确定要删除选中的 ${rows.length} 条订单吗？`,
            '批量删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).catch(() => false)

        if (!confirmResult) return

        const ids = rows.map(row => row.id!).filter(Boolean)
        await mutationApis.deleteTutor(ids)
        ElMessage.success('批量删除成功')
        fetchTutorList()
    } catch (error) {
        console.error('批量删除失败:', error)
        ElMessage.error('批量删除失败')
    }
}

// 批量更新可见性
const handleBatchVisibility = async (rows: TutorOrder[]) => {
    try {
        // 先统计当前状态
        const visibleCount = rows.filter(row => row.is_visible).length
        const hiddenCount = rows.length - visibleCount
        
        // 弹出确认框让用户选择操作
        const confirmResult = await ElMessageBox.confirm(
            `选中的 ${rows.length} 条订单中:
             ${visibleCount} 条可见
             ${hiddenCount} 条隐藏
             
             请选择要执行的操作`,
            '批量更新可见性',
            {
                confirmButtonText: '全部显示',
                cancelButtonText: '全部隐藏',
                distinguishCancelAndClose: true,
                type: 'info'
            }
        ).catch(action => action) // 捕获操作类型

        // 根据用户选择决定目标状态
        let targetStatus: 0 | 1
        if (confirmResult === 'confirm') {
            targetStatus = 1 // 全部显示
        } else if (confirmResult === 'cancel') {
            targetStatus = 0 // 全部隐藏
        } else {
            return // 用户关闭弹窗,不执行操作
        }

        const ids = rows.map(row => row.id!).filter(Boolean)
        await mutationApis.updateTutorStatus(ids, targetStatus)
        ElMessage.success(`批量${targetStatus === 1 ? '显示' : '隐藏'}成功`)
        fetchTutorList()
    } catch (error) {
        console.error('批量更新可见性失败:', error)
        ElMessage.error('批量更新失败')
    }
}

// 批量更新状态
const handleBatchStatus = async (rows: TutorOrder[]) => {
    try {
        // 先统计当前状态
        const dealCount = rows.filter(row => row.status === '已成交').length
        const undealCount = rows.length - dealCount
        
        // 弹出确认框让用户选择操作
        const confirmResult = await ElMessageBox.confirm(
            `选中的 ${rows.length} 条订单中:
             ${dealCount} 条已成交
             ${undealCount} 条未成交
             
             请选择要执行的操作`,
            '批量更新成交状态',
            {
                confirmButtonText: '全部成交',
                cancelButtonText: '全部未成交',
                distinguishCancelAndClose: true,
                type: 'info'
            }
        ).catch(action => action) // 捕获操作类型

        // 根据用户选择决定目标状态
        let newStatus: '已成交' | '未成交'
        if (confirmResult === 'confirm') {
            
            const ids = rows.map(row => row.id!).filter(Boolean)
            await mutationApis.updateOrderDealStatus(ids, {
                teacherId: null,
                status: '已成交'
            })
        } else if (confirmResult === 'cancel') {
            // 全部标记为未成交
            const ids = rows.map(row => row.id!).filter(Boolean)
            await mutationApis.updateOrderDealStatus(ids, {
                teacherId: null,
                status: '未成交'
            })
        } else {
            return // 用户关闭弹窗,不执行操作
        }
        
        ElMessage.success('批量更新状态成功')
        fetchTutorList()
    } catch (error) {
        console.error('批量更新状态失败:', error)
        ElMessage.error('批量更新失败')
    }
}

// 获取订单列表
const fetchTutorList = async (params?: Partial<tutorQueryParams>) => {
  // 避免重复请求
  if (loading.value) return

  try {
    loading.value = true
    console.log('开始获取订单列表，参数:', params)
    
    const res = await TutorsService.getTutorList(params || queryParams.value)
    
    if (res.code === 200) {
      tutorList.value = res.data.list
      total.value = res.data.total
    } else {
      throw new Error(res.message || '获取订单列表失败')
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = async (params: Partial<tutorQueryParams>) => {
  console.log('搜索参数:', params)  // 添加日志
  tutorStore.updateSearchParams(params)
  await fetchTutorList(tutorStore.searchParams)
}

// 处理分页
const handlePageChange = (page: number) => {
    const params = {
        ...tutorStore.searchParams,
        page
    }
    tutorStore.updateSearchParams(params)
    fetchTutorList(params)
}

// 添加一个标记，用于避免重复请求
const isFirstLoad = ref(true)

// 修改路由守卫
router.beforeEach((to, from, next) => {
  if (to.name === 'tutorList' && from.name !== 'tutorList') {
    console.log('进入家教列表页面')
    // 如果不是首次加载，才刷新数据
    if (!isFirstLoad.value) {
      nextTick(() => {
        fetchTutorList(tutorStore.searchParams)
      })
    }
  }
  next()
})

// 修改 activated 钩子
onActivated(() => {
  // 如果不是首次加载且路由名称是 tutorList，才刷新数据
  if (!isFirstLoad.value && router.currentRoute.value.name === 'tutorList') {
    fetchTutorList(tutorStore.searchParams)
  }
})

// 修改 onMounted 钩子
onMounted(async () => {
  if (isFirstLoad.value) {
    try {
      // 1. 初始化表格配置
      initTableConfig()
      
      // 2. 初始化搜索参数
      tutorStore.initSearchParams()
      
      // 3. 获取列表数据
      await fetchTutorList(tutorStore.searchParams)
      
      // 标记首次加载完成
      isFirstLoad.value = false
    } catch (error) {
      console.error('初始化失败:', error)
      ElMessage.error('初始化失败')
      loading.value = false
    }
  }
})

// 成功回调
const handleSuccess = async () => {
    try {
        await fetchTutorList(tutorStore.searchParams)
    } catch (error) {
        console.error('刷新列表失败:', error)
        ElMessage.error('刷新列表失败')
    }
}

// 打开编辑弹窗
const handleEdit = (row: TutorOrder) => {
    currentTutor.value = row
    editVisible.value = true
}

// 处理单个删除
const handleDelete = async (row: TutorOrder) => {
  try {
    const confirmResult = await ElMessageBox.confirm(
      '确定要删除该订单吗？',
      '删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch(() => false)

    if (!confirmResult) return

    await mutationApis.deleteTutor(row.id!)
    ElMessage.success('删除成功')
    fetchTutorList()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

// 处理单个可见性更新
const handleVisibilityChange = async (row: TutorOrder) => {
  try {
    await mutationApis.updateTutorStatus(row.id!, row.is_visible ? 0 : 1)
    ElMessage.success('更新成功')
    fetchTutorList()
  } catch (error) {
    console.error('更新可见性失败:', error)
    ElMessage.error('更新失败')
  }
}

// 处理单个状态更新
const handleStatusChange = async (row: TutorOrder) => {
  try {
    const newStatus = row.status === '已成交' ? '未成交' : '已成交'
    
    if (newStatus === '已成交') {
      await mutationApis.updateOrderDealStatus(row.id!, {
        teacherId: null,
        status: newStatus
      })
    } else {
      const confirmResult = await ElMessageBox.confirm(
        '确定要取消该订单的成交状态吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(() => false)

      if (!confirmResult) return

      await mutationApis.updateOrderDealStatus(row.id!, {
        teacherId: null,
        status: newStatus
      })
    }
    
    ElMessage.success('更新成功')
    fetchTutorList()
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新失败')
  }
}

// 处理列变化
const handleColumnsChange = (selectedColumns: string[]) => {
  const newColumns = getAllColumns(userCity.value).filter(col => 
    selectedColumns.includes(col.prop)
  )
  
  // 更新配置
  tableConfig.value = {
    ...tableConfig.value,
    columns: newColumns
  }
  
  // 同时更新 store
  tutorStore.setTableConfig(tableConfig.value)
}

// 初始化表格配置
const initTableConfig = () => {
  const stored = localStorage.getItem('tutorTableColumns')
  
  if (stored) {
    try {
      const selectedColumns = JSON.parse(stored)
      const newColumns = getAllColumns(userCity.value).filter(col => 
        selectedColumns.includes(col.prop)
      )
      
      const newConfig: TableConfig = {
        ...getDefaultTableConfig(userCity.value),
        columns: newColumns
      }
      
      tutorStore.setTableConfig(newConfig)
    } catch (e) {
      tutorStore.setTableConfig(getDefaultTableConfig(userCity.value))
    }
  } else {
    tutorStore.setTableConfig(getDefaultTableConfig(userCity.value))
  }
}

// 移除路由守卫，改用 watch
watch(
  () => router.currentRoute.value.name,
  (newRouteName) => {
    if (newRouteName === 'tutorList' && !isFirstLoad.value) {
      nextTick(() => {
        fetchTutorList(tutorStore.searchParams)
      })
    }
  }
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as vars;

.tutor-list {
    padding: 20px;
    
    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
}

// 平板
@media screen and (max-width: vars.$device-ipad) {
    .tutor-list {
        padding: 10px;
    }
}

// 手机
@media screen and (max-width: vars.$device-phone) {
    .tutor-list {
        padding: 0;
        
        .table-header {
            padding: 0 10px;
        }
    }
}
</style>