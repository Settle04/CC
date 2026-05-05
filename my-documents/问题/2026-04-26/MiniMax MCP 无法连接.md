# MiniMax MCP 无法连接

## 问题描述

- WSL2 环境
- Claude Code 配置了 MiniMax MCP (`minimax-coding-plan-mcp`)
- `claude mcp list` 显示 MiniMax 状态为 `Failed to Connect`

## 原因

- `uvx` 命令缺失导致 MCP 服务器无法启动
- 需要安装 uvx 并使用绝对路径配置

## 相关方法

→ [方法库/MCP配置/MiniMax MCP 配置指南](../../方法库/MCP配置/MiniMax%20MCP%20配置指南.md)

## 状态

- **已解决**
