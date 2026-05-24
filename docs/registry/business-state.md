# Triavatar Business State

## Registry Role

- 本文件是 `Triavatar` 的 business registry 工作层。
- `Triavatar` 的 `product-state.md` 与 `code-state.md` 默认应以本文件作为业务上游约束。

## Module Business Role

- `Triavatar` 负责用户侧 Web 入口，并预留未来虚拟形象与游戏化入口。
- 当前最直接的商业职责是承接终端用户前台体验，而不是平台 provider 控制面。

## Current Default Business Position

- 当前默认定位是“用户前台入口层”。
- 平台 provider 配置、模型启停、路由策略和平台计量不应继续在 `Triavatar` 内作为用户侧设置主入口暴露。

## Boundary Notes

- `Triavatar` 应消费 `Tristaciss` 提供的可用模型、配额、消费状态和统一 API 合同。
- 若未来支持用户自带密钥，默认也应优先考虑经由平台代理的形态，而不是直接恢复旧的前端 provider 配置工作台。
- 虚拟形象与游戏入口在未有真实实现前必须保持为规划中。

## Sources

- `../../AGENTS.md`
- `../../README.md`
- `../../src/App.tsx`
- `../../src/components/settings/UserSettings.tsx`