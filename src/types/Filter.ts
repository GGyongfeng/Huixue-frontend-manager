// 定义单个筛选条件的状态接口
export interface FilterSelection {
  selected: string[]      // 当前选中的选项数组
  checkAll: boolean       // 是否全选
  isIndeterminate: boolean // 是否半选状态
}

// 定义所有筛选条件的状态接口（前端状态）
export interface FilterState {
  [key: string]: FilterSelection
}

// 定义查询参数中的筛选条件格式（后端接口）
export interface QueryFilters {
  [key: string]: string[]
}

// 转换函数
export const filterStateToQuery = (state: FilterState): QueryFilters => {
  const result: QueryFilters = {}
  Object.entries(state).forEach(([key, value]) => {
    if (value.selected.length > 0) {
      result[key] = Array.from(value.selected)
    }
  })
  return result
} 