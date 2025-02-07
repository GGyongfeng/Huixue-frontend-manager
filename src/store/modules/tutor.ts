import { defineStore } from 'pinia'
import type { TutorOrder } from '@/types/tutorOrder'
import type { TableColumn, TableConfig } from '@/types/tutorMenuList'
import type { tutorQueryParams } from '@/types/tutorOrder'
import type { FilterSelection, FilterState } from '@/types/Filter'
import { filterStateToQuery } from '@/types/Filter'
import { DEFAULT_TABLE_CONFIG } from '@/types/tutorMenuList'

const FILTER_STORAGE_KEY = 'tutor_filter_selections'

// 从localStorage读取筛选条件
const getStoredFilters = (): FilterState => {
  try {
    const stored = localStorage.getItem(FILTER_STORAGE_KEY)
    const filters = stored ? JSON.parse(stored) : {}
    
    // 确保 created_at 筛选条件存在
    if (!filters.created_at) {
      filters.created_at = {
        selected: [],
        checkAll: false,
        isIndeterminate: false
      }
    }
    
    return filters
  } catch (e) {
    console.error('读取筛选条件失败:', e)
    return {}
  }
}

// 保存筛选条件到localStorage
const saveFilters = (filters: FilterState) => {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters))
  } catch (e) {
    console.error('保存筛选条件失败:', e)
  }
}

export const useTutorStore = defineStore('tutor', {
  state: () => ({
    currentTutor: null as TutorOrder | null,  // 当前选中的家教订单
    tutorList: [] as TutorOrder[],            // 家教订单列表
    total: 0,                                // 订单总数
    loading: false,                          // 加载状态
    filterSelections: getStoredFilters() as FilterState,      // 所有列的筛选条件状态
    searchParams: {
      page: 1,
      pageSize: 20,
      keyword: '',
      filters: {}
    } as Partial<tutorQueryParams>,
    tableConfig: { ...DEFAULT_TABLE_CONFIG } as TableConfig  // 添加表格配置状态
  }),
  
  actions: {
    // 设置当前选中的订单
    setCurrentTutor(tutor: TutorOrder) {
      this.currentTutor = tutor
    },
    
    // 设置订单列表
    setTutorList(list: TutorOrder[]) {
      this.tutorList = list
    },
    
    // 设置订单总数
    setTotal(total: number) {
      this.total = total
    },
    
    // 设置加载状态
    setLoading(loading: boolean) {
      this.loading = loading
    },
    
    // 初始化筛选条件状态
    initFilterSelections(columns: TableColumn[]) {
      // 获取已保存的筛选条件
      const storedFilters = getStoredFilters()
      
      columns.forEach(col => {
        if (col.select?.type === 'multiple' || col.dateRange) {
          // 如果有保存的筛选条件，使用保存的值
          if (storedFilters[col.prop]) {
            this.filterSelections[col.prop] = storedFilters[col.prop]
          } else {
            this.filterSelections[col.prop] = {
              selected: [],
              checkAll: false,
              isIndeterminate: false
            }
          }
        }
      })
      
      // 确保创建时间筛选条件存在并保持其值
      if (!this.filterSelections.created_at) {
        this.filterSelections.created_at = storedFilters.created_at || {
          selected: [],
          checkAll: false,
          isIndeterminate: false
        }
      }
      
      // 保存初始化后的状态
      saveFilters(this.filterSelections)
      // 同步更新 searchParams
      this.updateSearchParams({
        ...this.searchParams,
        filters: filterStateToQuery(this.filterSelections)
      })
    },
    
    // 更新某一列的筛选选项
    updateFilterSelection(prop: string, selected: string[]) {
      // 确保该属性的筛选条件存在
      if (!this.filterSelections[prop]) {
        this.filterSelections[prop] = {
          selected: [],
          checkAll: false,
          isIndeterminate: false
        }
      }
      
      this.filterSelections[prop].selected = selected
      // 保存到本地存储
      saveFilters(this.filterSelections)
      // 同步更新 searchParams
      this.updateSearchParams({
        ...this.searchParams,
        filters: filterStateToQuery(this.filterSelections)
      })
    },
    
    // 更新某一列的全选状态
    updateFilterCheckAll(prop: string, checkAll: boolean, isIndeterminate: boolean) {
      if (this.filterSelections[prop]) {
        this.filterSelections[prop].checkAll = checkAll
        this.filterSelections[prop].isIndeterminate = isIndeterminate
        // 保存到本地存储
        saveFilters(this.filterSelections)
        // 同步更新 searchParams
        this.updateSearchParams({
          ...this.searchParams,
          filters: filterStateToQuery(this.filterSelections)
        })
      }
    },
    
    // 清除所有筛选条件
    clearFilterSelections() {
      Object.keys(this.filterSelections).forEach(prop => {
        this.filterSelections[prop].selected = []
        this.filterSelections[prop].checkAll = false
        this.filterSelections[prop].isIndeterminate = false
      })
      
      // 清除本地存储
      localStorage.removeItem(FILTER_STORAGE_KEY)
      // 同步更新 searchParams
      this.updateSearchParams({
        ...this.searchParams,
        filters: {}  // 清空筛选条件
      })
    },
    
    // 初始化搜索参数
    initSearchParams() {
      this.searchParams = {
        page: 1,
        pageSize: 20,
        keyword: '',
        filters: filterStateToQuery(this.filterSelections)
      }
    },
    
    // 更新搜索参数
    updateSearchParams(params: Partial<tutorQueryParams>) {
      this.searchParams = {
        ...this.searchParams,
        ...params,
        filters: filterStateToQuery(this.filterSelections)
      }
    },
    
    // 重置搜索参数
    resetSearchParams() {
      this.searchParams = {
        page: 1,
        pageSize: 20,
        keyword: '',
        filters: filterStateToQuery(this.filterSelections)
      }
    },
    
    // 添加设置表格配置的 action
    setTableConfig(config: TableConfig) {
      this.tableConfig = config
    }
  }
}) 