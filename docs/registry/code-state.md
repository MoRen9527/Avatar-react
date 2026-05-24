# Triavatar Code State

## Repository Map

- `src/components/`：通用组件、聊天组件、仪表盘组件
- `src/pages/`：页面级组件
- `src/store/`：状态管理
- `src/services/`：API 服务
- `src/styles/`：样式文件
- `src/contexts/`：上下文

## Current Code Health

- 当前已有清晰的前端工程结构。
- 尚未建立 registry 级代码健康评分和 git 健康摘要。

## Change Tracking Baseline

- 关键关注页面、状态管理、服务层和共用 UI 组件的结构变化。

- 涉及具体项目代码仓库时，技术侧文档基线应按 `docs/engineering/DESIGN.md`、技术版 `ROADMAP.md`、技术版 `STATE.md` 以及 `docs/execution/<workstream>/<phase>/PLAN.md`、`SUMMARY.md`、`VERIFICATION.md` 维护；若缺失，应视为待补齐的技术或执行层缺口。

## Local CodeGraph Index

- 2026-05-24 已由 CTO 小狄技术线完成本地 CodeGraph 试点初始化，并由本模块 CodeRegistry 接管索引摘要。
- 索引范围采用分区索引：`src/`、`tests/`、`e2e/`；不使用仓根索引，避免依赖缓存、构建产物或测试输出污染模块代码事实。
- 当前摘要：
  - `src/`：90 files，859 nodes，1,305 edges，languages `tsx, typescript`。
  - `tests/`：8 files，23 nodes，30 edges，languages `javascript, typescript`。
  - `e2e/`：1 file，4 nodes，4 edges，language `javascript`。
- 当前 pending changes 均为 `0/0/0`；`.codegraph/` 只作为本地缓存，不作为仓库真源提交。
- 本地 `.gitignore` 已补充 `.codegraph/`、`node_modules/`、构建产物和测试输出排除规则。

## Git Health

- 2026-05-24 已由 CTO 小狄技术线执行仓库瘦身：`node_modules/` 的 82,800 个已跟踪依赖缓存文件已通过 `git rm -r --cached -- node_modules` 从 Git 索引移出，本地依赖目录保留。
- 2026-05-24 已继续将 `build/` 生成物从 Git 索引移出，本地构建目录保留；后续以 `npm run build` 重新生成，不再把构建产物作为仓库真源。
- `package.json` 与 `package-lock.json` 仍作为依赖真源保留跟踪；`.gitignore` 已加入 `node_modules/`，后续不应重新提交依赖缓存。
- 瘦身来源：`node_modules/` 文件来自初始提交 `f320dd3f7`（`chore: initial import`）。
- 当前仍需注意：本轮瘦身会在 Git 状态中表现为大量 `node_modules/**` 删除，提交前应和 `.gitignore`、CodeRegistry 摘要一起作为一次仓库瘦身变更处理。

## Quality Risks

- README 中包含未来规划，需要与现役代码持续分离。
- 若不持续更新前端能力边界，Role Agents 容易高估入口成熟度。

## Sources

- `../../src/`
- `../../README.md`
- `../../package.json`
- `../../vite.config.ts`
