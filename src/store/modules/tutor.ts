import { defineStore } from 'pinia'
import type { TutorType } from '@/types/tutorOrder'
import type { TableColumn } from '@/types/tutorMenuList'
import type { tutorQueryParams } from '@/types/tutorOrder'
import type { FilterSelection, FilterState } from '@/types/Filter'
import { filterStateToQuery } from '@/types/Filter'

const FILTER_STORAGE_KEY = 'tutor_filter_selections'

// 从localStorage读取筛选条件
const getStoredFilters = (): FilterState => {
  try {
    const stored = localStorage.getItem(FILTER_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
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
    currentTutor: null as TutorType | null,  // 当前选中的家教订单
    tutorList: [] as TutorType[],            // 家教订单列表
    total: 0,                                // 订单总数
    loading: false,                          // 加载状态
    filterSelections: getStoredFilters() as FilterState,      // 所有列的筛选条件状态
    searchParams: {
      page: 1,
      pageSize: 20,
      keyword: '',
      filters: {}
    } as Partial<tutorQueryParams>
  }),
  
  actions: {
    // 设置当前选中的订单
    setCurrentTutor(tutor: TutorType | null) {
      this.currentTutor = tutor
    },
    
    // 设置订单列表
    setTutorList(list: TutorType[]) {
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
      
      // 获取可筛选的列
      const filterableColumns = columns.filter(col => col.select?.type === 'multiple')
      console.log('可筛选的列:', {
        总列数: columns.length,
        可筛选列数: filterableColumns.length,
        可筛选列: filterableColumns.map(col => ({
          属性名: col.prop,
          标签: col.label,
          选项: col.select?.options
        }))
      })
      
      columns.forEach(col => {
        if (col.select?.type === 'multiple') {
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
      if (this.filterSelections[prop]) {
        this.filterSelections[prop].selected = selected
        // 保存到本地存储
        saveFilters(this.filterSelections)
        // 同步更新 searchParams
        this.updateSearchParams({
          ...this.searchParams,
          filters: filterStateToQuery(this.filterSelections)
        })
      }
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
    }
  }
}) 