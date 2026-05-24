# Triavatar Agent Rules

## Module Role

- Triavatar 负责 Web 入口和未来的虚拟形象 / 游戏入口。
- 它可以与 `TriMobile` 等其他端配合，承接 Web 端、虚拟形象和未来游戏化体验。

## Strategy Delegation

- 涉及总体商业模式、当前商业实验、Triavatar 是否进入首轮试点、与 TriMobile 的边界，先咨询 `TriMetaverse/BusinessStrategy`。

## Local Fact Sources

- 产品事实：`README.md`、`package.json`
- 代码事实：`src/`、`vite.config.ts`、测试配置

## Current Registries

- `TriavatarBusinessStrategyRegistry`
- `TriavatarProductRegistry`
- `TriavatarCodeRegistry`

当前 registry agent canonical discovery 位于 `Triavatar/.github/agents/`。同名中央 discovery 文件不应在 `TriMetaverse/.github/agents/` 并行保留；中央只通过 manifest 和 registry closeout 工作流路由本模块 registry。

## Update Discipline

- 对未来 3D / 4D 和游戏入口必须区分“已实现”与“规划中”，不要混写。
