import type { TutorOrder } from './tutorOrder'
import { ORDER_ITEM_OPTIONS } from '@/types/OrderOptions'
import { CITY_DISTRICTS, CREATED_BY_NAME, type City } from '@/config/cityConfig'

// 选择类型
type SelectType = 'multiple' | 'none'

// 四字标签的统一宽度
const FOUR_CHAR_LABEL_WIDTH = 110

// 表格列的配置类型
export interface TableColumn {
  prop: string
  label: string
  width?: number
  fixed?: boolean | 'left' | 'right'
  formatter?: (row: TutorOrder) => string
  slot?: string   // 可选的插槽名称
  visible?: boolean  // 控制列的显示/隐藏
  comment?: string   // 注释说明
  select?: {
    type: SelectType  // 选择类型：单选/多选/无
    options: string[] // 可选值列表
  }
  dateRange?: boolean  // 新增日期范围选择配置
}

// 所有可能的列配置
export const ALL_COLUMNS: TableColumn[] = [
  { 
    prop: 'tutor_code', 
    label: '订单编号', 
    width: 120,
    visible: true,
    comment: '订单的唯一编号'
  },
  { 
    prop: 'student_grade', 
    label: '学生年级', 
    width: FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '学生所在年级',
    select: {
      type: 'multiple',
      options: [...ORDER_ITEM_OPTIONS.student_grades]
    }
  },
  { 
    prop: 'subjects', 
    label: '科目筛选', 
    width: FOUR_CHAR_LABEL_WIDTH,
    formatter: (row: TutorOrder) => Array.isArray(row.subjects) ? row.subjects.join('、') : row.subjects,
    visible: true,
    comment: '需要补习的科目',
    select: {
      type: 'multiple',
      options: [...ORDER_ITEM_OPTIONS.subjects]
    }
  },
  { 
    prop: 'district', 
    label: '区域', 
    width: 90,
    visible: true,
    comment: '所在区域',
    select: {
      type: 'multiple',
      options: [...ORDER_ITEM_OPTIONS.districts['天津']] // 默认显示天津的区域
    }
  },
  { 
    prop: 'city', 
    label: '城市', 
    width: 90,
    visible: true,
    comment: '所在城市'
  },
  { 
    prop: 'address', 
    label: '地址', 
    width: 200,
    visible: true,
    comment: '详细地址'
  },
  { 
    prop: 'original_text', 
    label: '订单内容', 
    width: 200,
    visible: true,
    comment: '订单内容'
  },
  { 
    prop: 'phone_number', 
    label: '联系电话', 
    width: 200,
    visible: true,
    comment: '联系电话'
  },
  { 
    prop: 'order_source', 
    label: '订单来源', 
    width: 200,
    visible: true,
    comment: '订单来源'
  },
  { 
    prop: 'is_visible', 
    label: '可见状态', 
    width: FOUR_CHAR_LABEL_WIDTH,
    visible: true,
    comment: '是否对外可见',
    select: {
      type: 'multiple',
      options: ['可见', '隐藏']
    }
  },
  { 
    prop: 'status', 
    label: '订单状态', 
    width: FOUR_CHAR_LABEL_WIDTH,
    slot: 'status',
    visible: true,
    comment: '订单成交状态',
    select: {
      type: 'multiple',
      options: ['已成交', '未成交']
    }
  },
  { 
    prop: 'created_at', 
    label: '创建时间', 
    width: 180,
    formatter: (row: TutorOrder) => {
      if (!row.created_at) return ''
      return new Date(row.created_at).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    },
    visible: true,
    comment: '创建时间',
    dateRange: true  // 启用日期范围选择
  },
  { 
    prop: 'created_by_name', 
    label: '创建人', 
    width: 100,
    visible: true,
    comment: '创建人姓名',
    select: {
      type: 'multiple',
      options: [...CREATED_BY_NAME['天津']] // 默认显示天津的选项
    }
  },
  { 
    prop: 'updated_at', 
    label: '更新时间', 
    width: 180,
    formatter: (row: TutorOrder) => {
      if (!row.updated_at) return ''
      return new Date(row.updated_at).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    },
    visible: true,
    comment: '最后更新时间'
  },
  { 
    prop: 'updated_by_name', 
    label: '更新人', 
    width: 100,
    visible: true,
    comment: '更新人姓名'
  },
  { 
    prop: 'deal_staff_name', 
    label: '成交人', 
    width: 100,
    visible: true,
    comment: '成交员工姓名'
  },
  // { 
  //   prop: 'deal_teacher_name', 
  //   label: '成交教师', 
  //   width: 100,
  //   visible: true,
  //   comment: '成交教师姓名'
  // },
  { 
    prop: 'operation', 
    label: '操作', 
    width: 160,
    fixed: 'right',
    slot: 'operation',
    visible: true,
    comment: '操作按钮'
  }
]

// 默认显示的列（从所有列中选择）
export const DEFAULT_COLUMNS: TableColumn[] = ALL_COLUMNS.filter(col => 
  ['tutor_code', 'student_grade', 'subjects', 'status', 'created_at','city','district', 'operation'].includes(col.prop)
)

// 表格配置
export interface TableConfig {
  columns: TableColumn[]
  showPagination?: boolean
  pageSize?: number
  border?: boolean
  stripe?: boolean
}

// 导出默认配置
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  columns: DEFAULT_COLUMNS,
  showPagination: true,
  pageSize: 20,
  border: true,
  stripe: true
}

// 获取默认表格配置
export function getDefaultTableConfig(city: City): TableConfig {
  return {
    ...DEFAULT_TABLE_CONFIG,
    columns: DEFAULT_COLUMNS.map(col => {
      if (col.prop === 'district' && col.select) {
        return {
          ...col,
          select: {
            ...col.select,
            options: [...CITY_DISTRICTS[city]]
          }
        }
      }
      return col
    })
  }
}

// 获取所有列配置
export function getAllColumns(city: City): TableColumn[] {
  return ALL_COLUMNS.map(col => {
    if (col.prop === 'district' && col.select) {
      return {
        ...col,
        select: {
          ...col.select,
          options: [...CITY_DISTRICTS[city]]
        }
      }
    }
    if (col.prop === 'created_by_name' && col.select) {
      return {
        ...col,
        select: {
          ...col.select,
          options: [...CREATED_BY_NAME[city]]
        }
      }
    }
    return col
  })
}

// 检查这些常量是否正确导出和定义
console.log('所有可用列:', ALL_COLUMNS)
console.log('默认显示列:', DEFAULT_COLUMNS)