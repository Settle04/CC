# `.claude.json` 配置文件详解

该文件位于 `C:\Users\77918\.claude.json`，是 **Claude Code CLI** 的本地配置文件，存储用户的使用状态、偏好、MCP 服务器配置等信息。

---

## 根级字段

| 字段 | 值 | 说明 |
|------|-----|------|
| `numStartups` | `31` | Claude Code 被启动的总次数（第 31 次启动）。 |
| `firstStartTime` | `"2026-05-04T10:07:59.045Z"` | 用户首次使用 Claude Code 的时间（UTC）。 |
| `hasCompletedOnboarding` | `true` | 用户已完成新手引导流程。 |
| `lastOnboardingVersion` | `"2.1.119"` | 用户最近一次看到的引导版本号。 |
| `lastReleaseNotesSeen` | `"2.1.119"` | 用户最后看到的版本发布说明版本号。 |
| `migrationVersion` | `12` | 内部数据结构迁移版本号，用于追踪配置升级历史。 |
| `opusProMigrationComplete` | `true` | Opus Pro 迁移已完成。 |
| `sonnet1m45MigrationComplete` | `true` | Sonnet 1M/4.5 迁移已完成。 |
| `unpinOpus47LaunchEffort` | `true` | 标记 Opus 4.7 发布相关的引导提示已被解除固定/取消置顶。 |
| `userID` | `"...hex..."` | 匿名用户唯一标识符（SHA-256 哈希），用于遥测和状态追踪，**不包含个人身份信息**。 |
| `officialMarketplaceAutoInstallAttempted` | `true` | 已尝试自动安装官方市场插件。 |
| `officialMarketplaceAutoInstalled` | `true` | 官方市场插件已成功自动安装。 |

---

## `tipsHistory` — 提示历史

记录用户看到过的各种功能提示及其**出现次数**。用于确保新功能提示不会过于频繁地打扰用户。

| Key | 次数 | 提示内容 |
|-----|------|----------|
| `new-user-warmup` | 1 | 新用户欢迎提示 |
| `plan-mode-for-complex-tasks` | 20 | 推荐复杂任务使用 Plan 模式 |
| `terminal-setup` | 22 | 终端设置提示 |
| `memory-command` | 17 | `/memory` 命令提示 |
| `theme-command` | 23 | `/theme` 主题切换提示 |
| `powershell-tool-env` | 13 | PowerShell 工具环境提示 |
| `status-line` | 28 | 底部状态栏提示 |
| `prompt-queue` | 20 | 提示队列功能提示 |
| `enter-to-steer-in-realtime` | 24 | 实时按 Enter 干预提示 |
| `color-when-multi-clauding` | 18 | 多实例颜色区分提示 |
| `todo-list` | 25 | 任务列表/待办提示 |
| `ide-upsell-external-terminal` | 29 | 推荐使用外部终端提示 |
| `install-github-app` | 17 | 安装 GitHub App 提示 |
| `install-slack-app` | 18 | 安装 Slack App 提示 |
| `drag-and-drop-images` | 18 | 拖拽图片提示 |
| `double-esc-code-restore` | 18 | 双击 Esc 恢复代码提示 |
| `continue` | 19 | `/continue` 命令提示 |
| `shift-tab` | 19 | Shift+Tab 快捷键提示 |
| `image-paste` | 29 | 粘贴图片提示 |
| `custom-agents` | 23 | 自定义 Agent 提示 |
| `agent-flag` | 25 | `--agent` 标记提示 |
| `desktop-app` | 26 | 桌面 App 提示 |
| `web-app` | 27 | Web App 提示 |
| `feedback-command` | 27 | `/feedback` 命令提示 |
| `permissions` | 22 | 权限系统提示 |
| `rename-conversation` | 27 | 重命名对话提示 |
| `custom-commands` | 12 | 自定义命令提示 |

---

## `projects` — 项目级配置

以项目路径为键，包含每个项目（工作目录）的独立配置。

```json
"C:/Users/77918/Documents/CC": { ... }
```

| 字段 | 值 | 说明 |
|------|-----|------|
| `allowedTools` | `[]` | 该项目已获用户允许的工具列表（空 = 每次需手动批准）。 |
| `mcpContextUris` | `[]` | MCP context URI 列表。 |
| `mcpServers` | `{}` | 项目级别的 MCP 服务器配置（此处为空，全局配置在下方）。 |
| `enabledMcpjsonServers` | `[]` | 通过 `.mcp.json` 文件启用的 MCP 服务器列表。 |
| `disabledMcpjsonServers` | `[]` | 通过 `.mcp.json` 文件禁用的 MCP 服务器列表。 |
| `hasTrustDialogAccepted` | `true` | 用户已接受该项目的工作目录信任对话框。 |
| `projectOnboardingSeenCount` | `1` | 项目级别引导提示出现过 1 次。 |
| `hasClaudeMdExternalIncludesApproved` | `false` | 未批准引用外部文件的 `CLAUDE.md` 包含（安全功能，暂未启用）。 |
| `hasClaudeMdExternalIncludesWarningShown` | `false` | 尚未显示过外部 CLAUDE.md 包含的警告。 |
| `lastGracefulShutdown` | `false` | 上次会话是否为正常关闭。 |
| `lastSessionId` | `"...uuid..."` | 上次会话的唯一 ID。 |

### 上次会话的使用统计

| 字段 | 值 | 说明 |
|------|-----|------|
| `lastCost` | `3.956 USD` | 上次会话的 API 总费用（约 4 美元）。 |
| `lastAPIDuration` | `362396 ms` | API 总耗时（含重试）。 |
| `lastAPIDurationWithoutRetries` | `362119 ms` | API 耗时（不含重试）。 |
| `lastToolDuration` | `51102 ms` | 工具调用总耗时。 |
| `lastDuration` | `3141611 ms` | 会话总时长（约 52 分钟）。 |
| `lastLinesAdded` | `4` | 本次会话新增代码行数。 |
| `lastLinesRemoved` | `1` | 本次会话删除代码行数。 |
| `lastTotalInputTokens` | `633450` | 总输入 token 数。 |
| `lastTotalOutputTokens` | `9294` | 总输出 token 数。 |
| `lastTotalCacheCreationInputTokens` | `95179` | 写入缓存的 token 数。 |
| `lastTotalCacheReadInputTokens` | `0` | 读取缓存的 token 数（本次未命中缓存）。 |
| `lastTotalWebSearchRequests` | `0` | 网络搜索请求次数。 |
| `lastFpsAverage` | `2.25` | 界面平均帧率（FPS）。 |
| `lastFpsLow1Pct` | `214.14` | 帧率的低 1% 分位数（这里数值偏高，可能是记录方式特殊的指标）。 |

### `lastModelUsage` — 模型用量明细

| 模型 | 输入 Token | 输出 Token | 缓存写入 | 缓存读取 | 费用 |
|------|-----------|-----------|---------|---------|------|
| `claude-haiku-4-5-20251001` (快速/轻量模型) | 3,064 | 1,312 | 0 | 0 | $0.0096 |
| `claude-opus-4-7[1m]` (主力模型) | 630,386 | 7,982 | 95,179 | 0 | $3.946 |

> 主力模型为 Opus 4.7，使用 `[1m]` 前缀（1 分钟 prompt 缓存 TTL）。

### `lastSessionMetrics` — 会话性能指标

采集自上次会话的性能统计数据：

| 指标 | count | min | max | avg | p50 | p95 | p99 |
|------|-------|-----|-----|-----|-----|-----|-----|
| `frame_duration_ms` (帧间隔) | 7071 | 0.09ms | 14.09ms | 0.83ms | 0.77ms | 1.20ms | 4.47ms |
| `pre_tool_hook_duration_ms` (工具前置钩子) | 33 | 0ms | 1ms | 0.09ms | 0ms | 1ms | 1ms |
| `hook_duration_ms` (普通钩子) | 4 | 0ms | 0ms | 0ms | 0ms | 0ms | 0ms |

> - frame_duration：每帧渲染耗时，p50 不到 1ms，说明界面很流畅
> - pre_tool_hook：工具执行前运行钩子的耗时
> - hook_duration：自定义钩子脚本的执行耗时

---

## `skillUsage` — 技能/功能的使用统计

记录用户使用过的 Claude Code 附加功能（Skills）。

| 技能名称 | 使用次数 | 最后使用时间 (UTC) |
|---------|---------|-------------------|
| `claude-hud:setup` | 1 | 2026-05-04 某个时间点（首次 HUD 设置） |
| `claude-hud:configure` | 2 | 同上（HUD 重新配置） |
| `superpowers:dispatching-parallel-agents` | 1 | 并行 Agent 调度功能 |
| `superpowers:subagent-driven-development` | 1 | 子 Agent 驱动开发功能 |

---

## `mcpServers` — MCP 服务器配置

通过 **Model Context Protocol (MCP)** 注册的外部工具服务器，使 Claude Code 能调用外部能力。

| 服务器名 | 类型 | 命令 | 作用 |
|----------|------|------|------|
| **fetch** | stdio | `npx mcp-fetch-server` | 允许 Claude Code 抓取网页内容（HTTP GET）。 |
| **context7** | stdio | `npx @upstash/context7-mcp` | 查询编程库的最新文档（替代过时的训练数据）。 |
| **github** | stdio | `npx @modelcontextprotocol/server-github` | GitHub API 集成：创建 PR、查看 Issue、搜索代码等。使用了 Personal Access Token 认证。 |
| **MiniMax** | stdio | `uvx minimax-coding-plan-mcp` | MiniMax 提供的 MCP 服务（使用 MiniMax API Key 和自定义 API Host）。 |
| **puppeteer** | stdio | `npx @modelcontextprotocol/server-puppeteer` | 基于 Puppeteer 的浏览器自动化，可导航页面、截图、点击等。使用本地 Chrome 浏览器。 |
| **playwright** | stdio | `npx @playwright/mcp` | 基于 Playwright 的浏览器自动化（比 Puppeteer 更新，功能更丰富）。使用 Chrome 浏览器模式。 |

### MCP 环境变量说明

| 服务器 | 变量名 | 含义 |
|--------|--------|------|
| github | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub 个人访问令牌（推荐替换为 fine-grained token 或限制权限）。 |
| MiniMax | `MINIMAX_API_KEY` | MiniMax API 的认证密钥。 |
| MiniMax | `MINIMAX_API_HOST` | MiniMax API 的请求地址。 |
| puppeteer | `PUPPETEER_EXECUTABLE_PATH` | 本地 Chrome 浏览器的可执行文件路径。 |

---

## 总结

该文件的核心作用：

1. **状态追踪** — 记录新手引导完成情况、功能提示展示次数、版本迁移状态
2. **用量统计** — 记录每次会话的 token 消耗、费用、性能指标
3. **项目配置** — 为每个工作目录（如 `CC`）存储独立的权限、信任状态
4. **MCP 集成** — 注册了 6 个 MCP 服务器（网页抓取、文档查询、GitHub 操作、浏览器自动化、AI 辅助编码）
5. **遥测数据** — 匿名用户 ID 用于产品改进

> **注意**：文件中包含 GitHub Personal Access Token 和 MiniMax API Key，建议不要将此文件提交到公开仓库。
