import type { TutorOrder } from '@/types/tutorOrder'
import { getDefaultOrderSelection, ORDER_ITEM_OPTIONS, type Subject, type StudentGrade, type TeacherType, type Gender, type District, type City } from '@/types/OrderOptions'

// 年级映射表
const GRADE_MAPPING: Record<string, StudentGrade> = {
    '七年级': '初一',
    '八年级': '初二',
    '九年级': '初三',
    '一年级': '小学',
    '二年级': '小学',
    '三年级': '小学',
    '四年级': '小学',
    '五年级': '小学',
    '六年级': '小学',
}

// 科目映射表
const SUBJECT_MAPPING: Record<string, Subject[]> = {
    '语数外': ['语文', '数学', '英语'],
    '数理化': ['数学', '物理', '化学'],
    '理综': ['物理', '化学', '生物'],
    '文综': ['政治', '历史', '地理'],
    '物化': ['物理', '化学'],
    '数物化': ['数学', '物理', '化学'],
    '理化': ['物理', '化学'],
    '政史': ['政治', '历史'],
    '政史地': ['政治', '历史', '地理'],
    '政地': ['政治', '地理'],
    '小四门': ['地理', '生物', '历史', '政治'],
    '语外': ['语文', '英语'],
    '外语': ['英语'],
    '全科': ['数学', '英语', '语文'],
    '道法': ['政治'],
    '语数英': ['语文', '数学', '英语'],
    '数英': ['数学', '英语'],
    '语数': ['语文', '数学'],
    '数语': ['数学', '语文'],
    '语英': ['语文', '英语'],
    '音标': ['英语'],
    '辅导作业': ['语文', '数学', '英语'],
    '陪学': ['语文', '数学', '英语'],
    '理科': ['数学', '物理', '化学'],
    '文科': ['英语', '语文'],
    '英': ['英语'],
    '化': ['化学'],
    '物': ['物理'],
    '数': ['数学'],
    '政': ['政治'],
    '史': ['历史'],
    '地': ['地理'],
    '生': ['生物'],
    '中文': ['语文'],
    '国际': ['国际课程'],
    '几何': ['数学'],
    '函数': ['数学'],
    '计算': ['数学'],
    '算术': ['数学'],
    '单词': ['英语'],
    '作业': ['数学', '语文', '英语'],
    '识字': ['语文'],
}

// 在文件开头添加城市区域映射表，使用更具体的类型
const DISTRICT_MAPPING: Record<City, readonly string[]> = {
    '北京': ORDER_ITEM_OPTIONS.districts['北京'],
    '天津': ORDER_ITEM_OPTIONS.districts['天津'],
    '西安': ORDER_ITEM_OPTIONS.districts['西安'],
    '上海': ORDER_ITEM_OPTIONS.districts['上海'],
    '南京': ORDER_ITEM_OPTIONS.districts['南京'],
    '武汉': ORDER_ITEM_OPTIONS.districts['武汉'],
}

// 添加一个通用的内容提取函数
function extractContent(line: string, key: string): string {
    // 移除【】括号和关键字，然后去掉开头的冒号
    return line
        .replace(new RegExp(`【${key}】|${key}`), '')
        .trim()
        .replace(/^[：:]\s*/, '')
}

export function parseOrderText(text: string, userCity: City): Partial<TutorOrder> {
    // 创建基础订单对象
    const defaultOrder = getDefaultOrderSelection(userCity)
    const order: Partial<TutorOrder> = {
        ...defaultOrder,
        city: userCity,
        original_text: ''  // 显式初始化 original_text
    }
    
    // 按行分割文本
    const lines = text.split('\n')
    
    // 过滤掉包含"号家教"的行，并清理末尾标点
    order.original_text = lines
        .filter(line => !line.includes('号家教'))
        .filter(line => line.trim())  // 过滤空行
        .join('\n')
        .replace(/[，,。.、""：:；;!！?？]+$/, '')  // 清理末尾标点
        .replace(/^"|"$/g, '')  // 清理首尾引号
        .trim()  // 去掉首尾空白
    
    // 提取订单编号（第一行中的数字）
    const codeMatch = lines[0].match(/(\d+)/)
    if (codeMatch) {
        order.tutor_code = codeMatch[1]
    }
    
    // 解析每一行
    lines.forEach(line => {
        // 学生性别
        if (line.includes('【学生性别】') || /^(男|女)孩?$/.test(line)) {
            order.student_gender = line.includes('女') ? '女' : '男'
        }
        
        // 学生年级
        if (line.includes('【学生年级】') || /年级/.test(line)) {
            const gradeText = extractContent(line, '学生年级')
            // 直接匹配已有选项
            const grade = ORDER_ITEM_OPTIONS.student_grades.find(g => gradeText.includes(g))
            if (grade) {
                order.student_grade = grade
            } else {
                // 使用映射表匹配
                for (const [key, value] of Object.entries(GRADE_MAPPING)) {
                    if (gradeText.includes(key)) {
                        order.student_grade = value
                        break
                    }
                }
            }
        }
        
        // 补习科目
        if (line.includes('【补习科目】') || line.includes('科目')) {
            const subjectsText = extractContent(line, '补习科目')
            // 设置科目描述
            order.subjects_desc = subjectsText
            
            // 提取科目到筛选数组
            const subjects = new Set<Subject>()
            
            // 直接匹配已有科目
            ORDER_ITEM_OPTIONS.subjects.forEach(subject => {
                if (subjectsText.includes(subject)) {
                    subjects.add(subject)
                }
            })
            
            // 使用映射表匹配
            Object.entries(SUBJECT_MAPPING).forEach(([key, mappedSubjects]) => {
                if (subjectsText.includes(key)) {
                    mappedSubjects.forEach(subject => subjects.add(subject))
                }
            })
            
            order.subjects = Array.from(subjects)
        }
        
        // 现阶段成绩
        if (line.includes('【现阶段成绩】')) {
            order.grade_score = extractContent(line, '现阶段成绩')
        }
        
        // 补习时间
        if (line.includes('【补习时间】') || line.includes('时间')) {
            order.tutoring_time = extractContent(line, '补习时间')
        }
        
        // 报价
        if (line.includes('【报价】') || line.includes('价格')) {
            order.salary = extractContent(line, '报价')
        }
        
        // 地址
        if (line.includes('【地址】') || line.includes('地址')) {
            const addressMatch = extractContent(line, '地址')
            
            if (addressMatch) {
                // 保存地址
                order.address = addressMatch
                console.log('提取到的地址文本:', addressMatch)
                
                // 先检查是否是线上
                if (addressMatch.toLowerCase().includes('线上') || 
                    addressMatch.includes('网课') || 
                    addressMatch.includes('在线') || 
                    addressMatch.includes('远程')) {
                    order.district = '线上' as any
                    return
                }
                
                // 获取用户所在城市的区域列表
                const userCityDistricts = DISTRICT_MAPPING[userCity]
                let foundDistrict = false
                
                // 遍历区域列表，检查每个区名是否出现在地址中
                for (const district of userCityDistricts) {
                    // 去掉"区"字后的区域名
                    const districtName = district.replace('区', '')
                    // 如果地址中包含区域名（不带"区"字），则认为匹配成功
                    if (addressMatch.includes(districtName)) {
                        console.log(`找到匹配区域: ${district}`)
                        order.district = district as any
                        foundDistrict = true
                        break
                    }
                }
                
                // 如果没有找到匹配的区域，设为其他
                if (!foundDistrict) {
                    console.log('未找到匹配的区域，设置为其他')
                    order.district = '其他' as any
                }
            }
        }
        
        // 教师要求
        if (line.includes('【对老师要求】') || line.includes('老师要求')) {
            const currentIndex = lines.indexOf(line)
            let requirementDesc = extractContent(line, '对老师要求')
            
            // 检查下一行是否也是要求的一部分
            if (currentIndex < lines.length - 1) {
                const nextLine = lines[currentIndex + 1]
                if (!nextLine.includes('【') && nextLine.trim()) {
                    requirementDesc += '，' + nextLine.trim()
                }
            }
            
            if (requirementDesc) {
                // 清理末尾的标点符号
                requirementDesc = requirementDesc.replace(/[，,。.、""：:；;!！?？]+$/g, '').trim()
                order.requirement_desc = requirementDesc
            }
            
            // 合并处理当前行和下一行的教师类型匹配
            const fullText = requirementDesc
            
            // 提取教师类型
            const teacherTypes: TeacherType[] = []
            if (fullText.includes('985')) teacherTypes.push('985学生')
            if (fullText.includes('在职')) teacherTypes.push('在职老师')
            if (teacherTypes.length > 0) {
                order.teacher_type = teacherTypes
            }
            
            // 提取性别要求
            const genderTypes: Gender[] = []
            if (fullText.match(/女老师|女教师|[，,]女[，,]|^女|[：:]\s*女/) || 
                line.endsWith('女')) {
                genderTypes.push('女')
            }
            if (fullText.match(/男老师|男教师|[，,]男[，,]|^男|[：:]\s*男/) || 
                line.endsWith('男')) {
                genderTypes.push('男')
            }
            if (genderTypes.length > 0) {
                order.teacher_gender = genderTypes
            }
        }
    })
    
    return order
}

/**
 * 解析可能包含多个订单的文本
 */
export function parseMultipleOrders(text: string, userCity: City): Partial<TutorOrder>[] {
    // 如果文本中不包含"号家教"，则视为单个订单
    if (!text.includes('号家教')) {
        return [parseOrderText(text, userCity)]
    }

    // 使用正则表达式匹配完整的订单号模式，并清理每个订单文本的引号
    const orderTexts = text
        .replace(/^"|"$/g, '')  // 先清理整个文本的首尾引号
        .split(/(?=\d{6}号家教)/)
        .filter(t => {
            const trimmed = t.trim()
            return trimmed && /^\d{6}号家教/.test(trimmed)
        })
        .map(t => t.replace(/^"|"$/g, '').trim())  // 清理每个订单文本的引号

    // 如果只有一个订单，直接返回
    if (orderTexts.length === 1) {
        return [parseOrderText(text.replace(/^"|"$/g, ''), userCity)]
    }

    // 解析每个订单文本
    return orderTexts.map(orderText => {
        try {
            return parseOrderText(orderText, userCity)
        } catch (error: unknown) {
            console.error('解析订单失败:', error)
            return {
                tutor_code: orderText.match(/(\d{6})号家教/)?.[1] || '',
                requirement_desc: `解析失败: ${error instanceof Error ? error.message : String(error)}`
            }
        }
    }).filter(order => order.tutor_code)
} 