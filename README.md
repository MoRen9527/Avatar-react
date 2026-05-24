# Triavatar

Triavatar 是三元宇宙体系中的 Web 入口模块，并预留未来虚拟形象与游戏化入口能力。

当前仓库内已经有一套可运行的 React/Vite/TypeScript 前端工程，但这不等于已经完成对 Tristaciss/avatar-react 的正式承接。现阶段更准确的口径是：Triavatar 已具备承接准备基础，正式切换仍需继续收口文档、命名和前后端配置合同。

## 当前状态

- 已实现：独立的 React 18 + Vite 5 + TypeScript 前端工程。
- 已实现：路由、登录页、首页、聊天页、仪表盘页、i18n 面板和若干演示页面。
- 已实现：通过 VITE_API_URL 连接后端 API，并在开发环境下支持 /api 回退。
- 已实现：Vitest、Playwright 和基础基线测试脚本入口。
- 规划中：正式承接 Tristaciss 前端职责，并扩展虚拟形象、游戏化入口能力。
- 待收口：历史命名、部分旧配置逻辑和模块对外说明仍需进一步整理。

## 技术栈

- React 18
- Vite 5
- TypeScript
- Material UI
- Redux Toolkit
- React Router
- Axios
- i18next / react-i18next
- Vitest
- Playwright

## 当前能力范围

### 已有页面与入口

- 登录页与 OIDC 授权回调。
- 首页与聊天历史入口。
- 单聊相关页面与仪表盘相关页面。
- 信息卡片、GameFi 和科幻 UI 演示页。
- i18n 调试页。

### 当前后端协作方式

- API 基址通过 VITE_API_URL 注入。
- 开发环境若未设置 VITE_API_URL，会回退到 /api。
- 生产环境要求显式提供 VITE_API_URL，否则前端会直接 fail-fast。
- 当前聊天主入口对接的是 Tristaciss FastAPI 的 /api/chat/stream。
- 认证流程当前通过独立 Auth Server 的 OIDC 授权链完成，前端负责跳转和回调处理。

## 目录结构

```text
Triavatar/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── components/
│   ├── hooks/
│   ├── i18n/
│   ├── locales/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── theme.ts
│   ├── types/
│   └── utils/
└── tests/
    ├── e2e/
    ├── fixtures/
    ├── integration/
    └── unit/
```

## 开发命令

先安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产包：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

运行单元测试：

```bash
npm test
```

运行端到端测试：

```bash
npm run test:e2e
```

运行当前仓内的基线测试集合：

```bash
npm run test:baseline
```

## 环境变量

最关键的前端环境变量如下：

```bash
VITE_API_URL=http://localhost:8008/api
```

说明：

- 开发环境建议显式配置 VITE_API_URL，避免依赖 /api 回退。
- 生产环境必须配置 VITE_API_URL。
- Auth Server 基址由前端在运行时根据 API 基址去掉 /api 后缀推导。

## 与 Tristaciss 的当前边界

- 当前 API 与认证链路仍主要依赖 Tristaciss 现役后端与认证服务。
- Triavatar 已具备独立前端工程形态，但尚未宣告成为前端正式唯一真源。
- 在正式承接前，仍需继续清理旧命名、旧配置假设和若干历史页面命名残留。

## 已知待收口事项

- 登录与身份相关文案中仍有 Tristaciss 命名残留。
- 前端配置链中仍存在历史 provider_settings / localStorage 假设。
- 个别页面和文件名仍带有历史迁移痕迹。
- 这些问题不影响继续作为承接准备仓推进，但会影响正式切换时的边界清晰度。

## 后续建议

- 先完成文档、命名和配置合同对齐。
- 再形成 avatar-react 到 Triavatar 的正式迁移清单。
- 最后再决定是否把 Triavatar 提升为前端正式承接模块。
