// 定义支持的城市类型
export type City = '天津' | '北京' | '西安' | '上海' | '南京' | '武汉'

// 城市配置接口
interface CityConfig {
  systemName: string
  teacherUrl: string
  description: string
}

// 城市配置映射
export const CITY_CONFIGS: Record<City, CityConfig> = {
  '天津': {
    systemName: '汇学家教',
    teacherUrl: 'https://orders.jiajiao123.xin/dGo/',
    description: '汇学家教后台管理平台，致力于为天津地区提供高效、便捷的家教订单管理和匹配服务'
  },
  '北京': {
    systemName: '汇鸣家教',
    teacherUrl: 'https://orders.jiajiao123.xin/Ymo/',
    description: '汇鸣家教后台管理平台，致力于为北京地区提供高效、便捷的家教订单管理和匹配服务'
  },
  '西安': {
    systemName: '汇博家教',
    teacherUrl: 'https://orders.jiajiao123.xin/xaYmo/',
    description: '汇博家教后台管理平台，致力于为西安地区提供高效、便捷的家教订单管理和匹配服务'
  },
  '上海': {
    systemName: '汇思家教',
    teacherUrl: 'https://orders.jiajiao123.xin/c2g/',
    description: '汇思家教后台管理平台，致力于为上海地区提供高效、便捷的家教订单管理和匹配服务'
  },
  '南京': {
    systemName: '卓悦家教',
    teacherUrl: 'https://orders.jiajiao123.xin/bmo/',
    description: '卓悦家教后台管理平台，致力于为南京地区提供高效、便捷的家教订单管理和匹配服务'
  },
  '武汉': {
    systemName: '启程家教',
    teacherUrl: 'https://orders.jiajiao123.xin/dp2g/',
    description: '启程家教后台管理平台，致力于为武汉地区提供高效、便捷的家教订单管理和匹配服务'
  }
} as const

// 获取城市配置的工具函数
export function getCityConfig(city: City): CityConfig {
  return CITY_CONFIGS[city] || CITY_CONFIGS['天津'] // 默认返回天津的配置
}

// 添加区域配置
export const CITY_DISTRICTS = {
    '天津': [
      '和平区',
      '河东区',
      '河西区',
      '南开区',
      '河北区',
      '红桥区',
      '东丽区',
      '西青区',
      '津南区',
      '北辰区',
      '武清区',
      '宝坻区',
      '滨海新区',
      '宁河区',
      '静海区',
      '蓟州区',
      '线上',
      '其他'
    ] as const,
    
    '北京': [
      '东城区',
      '西城区',
      '朝阳区',
      '丰台区',
      '石景山区',
      '海淀区',
      '门头沟区',
      '房山区',
      '大兴区',
      '通州区',
      '顺义区',
      '昌平区',
      '怀柔区',
      '平谷区',
      '密云区',
      '延庆区',
      '线上',
      '其他'
    ] as const,
  
    '西安': [
      '新城区',
      '碑林区',
      '莲湖区',
      '灞桥区',
      '未央区',
      '雁塔区',
      '阎良区',
      '临潼区',
      '长安区',
      '高陵区',
      '鄠邑区',
      '线上',
      '其他'
    ] as const,
  
    '上海': [
      '黄浦区',
      '徐汇区',
      '长宁区',
      '静安区',
      '普陀区',
      '虹口区',
      '杨浦区',
      '浦东新区',
      '闵行区',
      '宝山区',
      '嘉定区',
      '金山区',
      '松江区',
      '青浦区',
      '奉贤区',
      '崇明区',
      '线上',
      '其他'
    ] as const,
  
    '南京': [
      '玄武区',
      '秦淮区',
      '建邺区',
      '鼓楼区',
      '栖霞区',
      '雨花台区',
      '江宁区',
      '浦口区',
      '六合区',
      '溧水区',
      '高淳区',
      '江北新区',
      '线上',
      '其他'
    ] as const,
  
    '武汉': [
      '江岸区',
      '江汉区',
      '硚口区',
      '汉阳区',
      '武昌区',
      '青山区',
      '洪山区',
      '东西湖区',
      '蔡甸区',
      '江夏区',
      '黄陂区',
      '新洲区',
      '汉南区',
      '线上',
      '其他'
    ] as const
  } as const

// 添加创建人配置
export const CREATED_BY_NAME = {
  '天津': ['小陈老师', '悦悦老师', '小杰老师'],
  '西安': ['汇博张老师', '小尹老师'],
  '北京': ['汇鸣崔老师', '柚子老师'],
  '南京': ['欧阳老师'],
  '上海': ['汇学崔老师', '小田老师'],
  '武汉': ['悠悠老师']
} as const