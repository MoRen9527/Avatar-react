# TriAvatar Product State

## Module Overview

- `TriAvatar` 负责 Web 入口、未来数字宠物、赛博分身和赛博任务；当前物理仓库路径仍为 `Triavatar/`，在显式 repo rename 前继续作为兼容路径。
- 它可以与 `TriMobile` 等其他端配合，承接 Web 端、虚拟形象、浏览器插件和未来游戏化体验。

## Current Product Scope（CPO 裁决 #12-#13, 2026-07-16）

### Phase 1 MVP：静态头像级（裁决 #12）

```
Phase 1 MVP:
  - 上传自定义头像（PNG/JPG/GIF）
  - AI 生成头像（基于文字描述，调用 TriModel 图像生成）
  - 头像与 TriMem 账户绑定，跨模块显示一致
  - 默认头像池（10-15 个预置选项）

Phase 1 不做：
  ❌ 3D 渲染引擎
  ❌ 骨骼动画 / 表情捕捉
  ❌ VRM / glTF 标准支持
  ❌ 虚拟试衣 / 配饰系统
```

### 数字宠物独立路线（裁决 #13）

- 数字宠物脱离 TriAvatar 模块，作为独立产品线 `TriPet`
- 在 20 模块全景中预留 `TriPet` 模块名，状态标记为 `DISCOVERY / 待规划`
- Phase 1 不包含 TriPet 任何功能

### 已有产品能力

- 当前以 React Web 入口为主，承接前端登录、聊天、群聊 WebSocket、仪表盘等体验
- 近期产品方向包括浏览器插件形态（网页侧助手）

- 涉及具体项目代码仓库时，产品侧文档基线应按 `PROJECT.md`、`REQUIREMENTS.md`、产品版 `ROADMAP.md` 和产品版 `STATE.md` 维护；若缺失，应视为待补齐的产品真源缺口。

## Current Progress

- 已具备根级 `AGENTS.md`、`README.md`、`package.json` 和首版 registry 工作层。
- README 已提供当前 React 前端的功能和结构概览。

## Bug And Gap State

- 当前更偏 Web 前端聊天与群聊体验能力，赛博分身 / 赛博任务 / 浏览器插件 / 游戏能力尚无充分实现证据
- 数字宠物已从 TriAvatar 剥离至独立模块 TriPet（DISCOVERY / 待规划）
- 与 `TriMobile` 的协同边界需要后续继续明确
- 3D 数字形象延至 Phase 2

## Cross-Module Dependencies

- 与 `TriMem` 在用户头像存储与跨模块显示上协同
- 与 `TriModel` 在 AI 生成头像（图像生成 API）上协同
- 与 `TriMobile` 在未来移动入口协作中相关
- 与 `TriPilot`、`TriStaciss`、`TriMetaverse` 在整体用户入口、模型调用和产品路径中存在协同

## Architecture State

- 当前以 React 18 + MUI 风格前端工程为核心。

## Sources

- `../../AGENTS.md`
- `../../README.md`
- `../../package.json`
- `CPO 路由包裁决 #12-#13` — `TriMetaverse/docs/workflow/operating-records/2026-W29/cpo-product-routing-package.md`
