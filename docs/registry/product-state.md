# TriAvatar Product State

## Module Overview

- `TriAvatar` 负责 Web 入口、未来数字宠物、赛博分身和赛博任务；当前物理仓库路径仍为 `Triavatar/`，在显式 repo rename 前继续作为兼容路径。
- 它可以与 `TriMobile` 等其他端配合，承接 Web 端、虚拟形象、浏览器插件和未来游戏化体验。

## Current Product Scope

- 当前以 React Web 入口为主，承接从 `TriStaciss` 产品侧迁出的前端登录、聊天、群聊 WebSocket、仪表盘等体验归属。
- 未来规划包含数字宠物、赛博分身、赛博任务、虚拟形象和游戏入口，但这些不应与现役 Web 能力混写。
- 近期产品方向包括浏览器插件形态，类似网页侧助手：可回答针对网页内容的问题，并逐步探索辅助网页自动化。

- 涉及具体项目代码仓库时，产品侧文档基线应按 `PROJECT.md`、`REQUIREMENTS.md`、产品版 `ROADMAP.md` 和产品版 `STATE.md` 维护；若缺失，应视为待补齐的产品真源缺口。

## Current Progress

- 已具备根级 `AGENTS.md`、`README.md`、`package.json` 和首版 registry 工作层。
- README 已提供当前 React 前端的功能和结构概览。

## Bug And Gap State

- 当前更偏 Web 前端聊天与群聊体验能力，数字宠物 / 赛博分身 / 赛博任务 / 浏览器插件 / 游戏能力尚无充分实现证据。
- 与 `TriMobile` 的协同边界需要后续继续明确。

## Cross-Module Dependencies

- 与 `TriMobile` 在未来移动入口协作中相关。
- 与 `TriPilot`、`TriStaciss`、`TriMetaverse` 在整体用户入口、模型调用和产品路径中存在协同。

## Architecture State

- 当前以 React 18 + MUI 风格前端工程为核心。

## Sources

- `../../AGENTS.md`
- `../../README.md`
- `../../package.json`
