<template>
    <div class="tutor-list">
        <div class="table-header">
            <TutorSearch @search="handleSearch" @column-change="handleColumnsChange" />
        </div>
        <div v-loading="loading">
            <TutorTable :loading="loading" :data="tutorList" :total="total" :config="tableConfig" @page-change="handlePageChange" @edit="handleEdit" @delete="handleDelete" @visibility-change="handleVisibilityChange" @status-change="handleStatusChange" />
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
import { ref, onMounted, computed } from 'vue'
import { useTutorStore } from '@/store/modules/tutor'
import TutorSearch from './components/tutorSearch/tutorSearch.vue'
import TutorTable from './components/tutorTable/tutorTable.vue'
import type { tutorQueryParams, TutorType, TutorResponse } from '@/types/tutorOrder'
import { TutorsService } from '@/api/tutors'
import { CreateDialog, EditDialog, DeleteDialog } from '@/views/tutors/components/dialogs'
import { DEFAULT_TABLE_CONFIG, ALL_COLUMNS } from '@/types/tutorMenuList'
import { ElMessageBox, ElMessage } from 'element-plus'
import { mutationApis } from '@/api/tutors/mutation'

// 使用 store
const tutorStore = useTutorStore()

// 响应式数据
const loading = ref(false)
const tutorList = ref<TutorType[]>([])
const total = ref(0)
const queryParams = ref<tutorQueryParams>({
    page: 1,
    pageSize: 20
})

// 弹窗控制
const createVisible = ref(false)
const editVisible = ref(false)
const deleteVisible = ref(false)
const currentTutor = ref<TutorType | undefined>(undefined)
const currentId = ref<number>()

const tableConfig = ref({ ...DEFAULT_TABLE_CONFIG })

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

// 在组件挂载时执行
onMounted(() => {
    initTableConfig()  // 初始化表格配置
    fetchTutorList(tutorStore.searchParams)  // 使用 store 中的搜索参数
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
const handleEdit = (row: TutorType) => {
    currentTutor.value = row
    editVisible.value = true
}

// 打开删除弹窗
const handleDelete = (row: TutorType) => {
    currentId.value = row.id
    deleteVisible.value = true
}

// 处理列变化
const handleColumnsChange = (selectedColumns: string[]) => {  
    // 从所有列中筛选用户选择的列，并保持其他配置不变
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

const handleVisibilityChange = async (row: TutorType) => {
    try {
        await TutorsService.updateTutor({
            ...row,
            is_visible: !row.is_visible
        })
        fetchTutorList()
    } catch (error) {
        console.error('更新可见性失败:', error)
    }
}

const handleStatusChange = async (row: TutorType) => {
    try {
        const newStatus = (row.status === '已成交' ? '未成交' : '已成交') as '已成交' | '未成交'
        
        // 如果是标记为已成交，才弹窗输入教师ID
        if (newStatus === '已成交') {
            ElMessageBox.prompt('请输入成交教师ID', '标记成交', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async ({ value: teacherId }) => {
                const params = {
                    teacherId: teacherId ? parseInt(teacherId) : null,
                    status: newStatus
                }
                
                await mutationApis.updateOrderDealStatus(row.id!, params)
                ElMessage.success('更新成功')
                fetchTutorList()
            })
        } else {
            // 取消成交时，先确认
            const confirmResult = await ElMessageBox.confirm(
                '确定要取消该订单的成交状态吗？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(() => false)

            if (confirmResult) {
                const params = {
                    teacherId: null,
                    status: newStatus
                }
                
                await mutationApis.updateOrderDealStatus(row.id!, params)
                ElMessage.success('更新成功')
                fetchTutorList()
            }
        }
    } catch (error) {
        console.error('更新状态失败:', error)
        ElMessage.error('更新失败')
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