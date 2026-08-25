# TriAvatar — 项目总览

> 本项目是赛博公司的用户侧 Web 入口模块，由 ADE project_scaffold CLI 基线演进而来。

## 项目信息

- **名称**: TriAvatar
- **类型**: module (React Web 前端)
- **创建时间**: 2025 (首次提交 f320dd3f7)
- **当前阶段**: Phase 1 MVP — 静态头像级

## 目录结构

```
TriAvatar/
├── docs/
│   ├── product/       # 产品侧文档 (PROJECT / REQUIREMENTS / ROADMAP / STATE)
│   ├── engineering/   # 技术侧文档 (DESIGN / ROADMAP / STATE)
│   ├── execution/     # 执行层文档
│   ├── registry/      # 状态登记文档 (business / product / code state)
│   ├── workflow/      # 流程与机制文档
│   └── training/      # 培训与导读文档
├── src/               # 源代码 (React 18 + MUI)
│   ├── components/    # 通用组件、聊天组件、仪表盘组件
│   ├── pages/         # 页面级组件
│   ├── store/         # 状态管理
│   ├── services/      # API 服务
│   ├── styles/        # 样式文件
│   └── contexts/      # 上下文
├── tests/             # 测试代码
├── e2e/               # 端到端测试
├── public/            # 静态资源
├── scripts/           # 构建与工具脚本
├── tools/             # 辅助工具
├── .github/           # Agent 配置
├── .gitignore
├── AGENTS.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── project.md
```

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI**: MUI (Material-UI) 风格
- **构建工具**: Vite
- **测试**: Vitest + Playwright (E2E)
- **状态管理**: React Context + 自定义 store

## 当前产品范围 (Phase 1 MVP)

- 上传自定义头像 (PNG/JPG/GIF)
- AI 生成头像 (基于文字描述，调用 TriModel 图像生成)
- 头像与 TriMem 账户绑定，跨模块显示一致
- 默认头像池 (10-15 个预置选项)

## 文档索引

- [产品文档](docs/product/)
- [技术文档](docs/engineering/)
- [执行记录](docs/execution/)
- [Registry](docs/registry/)
- [Workflow](docs/workflow/)
- [Training](docs/training/)
