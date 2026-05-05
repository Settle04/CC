# MCP 配置重置后失效

## 问题描述

之前配置好的 Playwright MCP，在 Claude Code 重启后消失，`/mcp` 中看不到了。

## 根本原因

Claude Code 重启后，`~/.claude.json` 中的 `mcpServers` 只有 MiniMax，没有 Playwright。需要重新添加。

## 解决方案

手动将 Playwright MCP 添加到 `~/.claude.json` 的 `mcpServers` 中：

```json
"Playwright": {
  "type": "stdio",
  "command": "node",
  "args": [
    "/home/settle/.nvm/versions/node/v24.15.0/lib/node_modules/mcp-playwright/cli.js"
  ]
}
```

## 预防措施

Claude Code 不会持久化非官方市场安装的 MCP 配置，重启后会丢失。
今后安装 MCP 后，检查 `~/.claude.json` 确认配置存在。

## 状态

**已解决** — 2026-04-26 Claude Code 重启后验证，Playwright MCP 正常加载。