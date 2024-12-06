# 汇学教育--后台管理系统（frontend）

## 📋项目介绍
慧学教育管理系统是一个基于 Vue 3 + TypeScript + Vite + Element Plus 的前端项目。

## 🔧技术栈
- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router
- Axios
- SCSS

#### 开发环境
- Node.js >= 16
- pnpm >= 8

## 🎯项目设置
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码格式化
pnpm lint:prettier

# 样式格式化
pnpm lint:stylelint
```

## 📁项目结构
```
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── api/            # API 接口
│   ├── assets/         # 资源文件
│   ├── components/     # 公共组件
│   ├── layouts/        # 布局组件
│   ├── router/         # 路由配置
│   ├── store/          # Pinia 状态管理
│   ├── styles/         # 全局样式
│   ├── utils/          # 工具函数
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── types/              # 类型声明
├── .env               # 环境变量
├── .gitignore         # Git 忽略文件
├── index.html         # HTML 模板
├── package.json       # 项目配置
├── tsconfig.json      # TypeScript 配置
└── vite.config.ts     # Vite 配置
```

#### 代码提交规范
项目使用 commitizen 进行代码提交规范化管理，提交代码时请使用：
```bash
pnpm commit
```

#### 开发规范
- 遵循 TypeScript 开发规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 Stylelint 进行样式规范检查

## 浏览器支持
- Chrome >= 87
- Firefox >= 78
- Safari >= 13
- Edge >= 88

## 👨‍💻作者信息
- 作者：古永丰
- 联系方式：15369998659
- GitHub：[https://github.com/GGyongfeng](https://github.com/guyongfeng)

## 🙏 鸣谢
本项目管理端前端框架参考了优秀的开源项目：

### [Art Design Pro](https://github.com/Daymychen/art-design-pro)

一个基于 Vue3、TypeScript、Vite 和 Element-Plus 精心打造的后台管理系统模板：

- 优雅的界面设计
- 完善的技术栈：Vue3 + TypeScript + Vite
- 丰富的组件库：基于 Element-Plus
- 专注于用户体验和视觉设计
- 提供多种实用功能和组件

感谢以上开源项目对本项目开发的启发和帮助。

## 📜许可证
版权所有 (c) 2024 古永丰

本作品采用知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议进行许可。
要查看该许可协议，可访问 https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh