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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTutorStore } from '@/store/modules/tutor'
import TutorSearch from '@/components/Tutors/tutorSearch/tutorSearch.vue'
import TutorTable from '@/components/Tutors/tutorTable/tutorTable.vue'
import type { tutorQueryParams, TutorOrder, TutorResponse } from '@/types/tutorOrder'
import { TutorsService } from '@/api/tutors'
import { CreateDialog, EditDialog, DeleteDialog } from '@/components/Tutors/dialogs'
import { DEFAULT_TABLE_CONFIG, ALL_COLUMNS } from '@/types/tutorMenuList'
import { ElMessageBox, ElMessage } from 'element-plus'
import { mutationApis } from '@/api/tutors/mutation'

const router = useRouter()

// 使用 store
const tutorStore = useTutorStore()

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

const tableConfig = ref({ ...DEFAULT_TABLE_CONFIG })

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
            // 全部标记为成交
            const { value: teacherId } = await ElMessageBox.prompt(
                '请输入成交教师ID',
                '批量标记成交',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }
            )
            
            const ids = rows.map(row => row.id!).filter(Boolean)
            await mutationApis.updateOrderDealStatus(ids, {
                teacherId: teacherId ? parseInt(teacherId) : null,
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

// 获取订单列表函数
const fetchTutorList = async (params?: Partial<tutorQueryParams>) => {
    try {
        // 使用 store 中的 searchParams 作为默认值
        const searchParams = params || tutorStore.searchParams
        const res = await TutorsService.getTutorList(searchParams)

        if (res.code === 200) {
            loading.value = true

            // 确保每条数据都有状态值
            tutorList.value = res.data.list.map(item => ({
                ...item,
                status: item.status || '未成交'  // 设置默认状态
            }))
            total.value = res.data.total

            // store 赋值
            tutorStore.setTutorList(tutorList.value)
            tutorStore.setTotal(res.data.total)
        }
    } catch (error) {
        console.error('获取订单列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 处理搜索
const handleSearch = (params: Partial<tutorQueryParams>) => {
    // console.log('List组件收到搜索参数:', params)
    fetchTutorList(params)
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

// 添加路由守卫
router.beforeEach((to, from, next) => {
  if (to.name === 'tutorList' && from.name !== 'tutorList') {
    console.log('进入家教列表页面，刷新数据')
    // 使用 nextTick 确保组件已经挂载
    nextTick(() => {
      fetchTutorList(tutorStore.searchParams)
    })
  }
  next()
})

// 保持原有的 onMounted
onMounted(() => {
  initTableConfig()
  fetchTutorList(tutorStore.searchParams)
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
      const { value: teacherId } = await ElMessageBox.prompt(
        '请输入成交教师ID',
        '标记成交',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }
      )
      
      await mutationApis.updateOrderDealStatus(row.id!, {
        teacherId: teacherId ? parseInt(teacherId) : null,
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
    // 从所有列筛选用户选择的列，并保持其他配置不变
    tableConfig.value = {
        ...DEFAULT_TABLE_CONFIG,
        columns: ALL_COLUMNS.filter(col => selectedColumns.includes(col.prop))
    }
}

// 初始化表格配置
const initTableConfig = () => {
    // 从 localStorage 获取保存的列配置
    const stored = localStorage.getItem('tutorTableColumns')
    
    if (stored) {
        try {
            const selectedColumns = JSON.parse(stored)
            
            // 使用保存的列配置初始化表格
            tableConfig.value = {
                ...DEFAULT_TABLE_CONFIG,
                columns: ALL_COLUMNS.filter(col => selectedColumns.includes(col.prop))
            }
        } catch (e) {
            console.error('解析列配置失败，使用默认配置:', e)
            tableConfig.value = { ...DEFAULT_TABLE_CONFIG }
        }
    } else {
        console.log('List - 未找到保存的列配置，使用默认配置')
        tableConfig.value = { ...DEFAULT_TABLE_CONFIG }
    }
}
</script>

<style lang="scss" scoped>
.tutor-list {
    padding: 20px;
    
    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
}
</style>