# MiniMax MCP 配置指南

## 来源问题
→ [问题集/2026-04-26/MiniMax MCP 无法连接](../../问题集/2026-04-26/MiniMax%20MCP%20无法连接.md)

## 概述

MiniMax MCP 提供 `web_search` 和 `understand_image` 两个工具，可用于网络搜索和图片理解。

## 前置条件

### 1. 安装 uvx

uvx 是 MiniMax MCP 的运行环境。

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

验证安装：
```bash
which uvx      # macOS/Linux
uvx --version  # 应显示版本号
```

### 2. 获取 MiniMax API Key

从 [MiniMax Token Plan](https://platform.minimaxi.com/subscribe/token-plan) 订阅页面获取 API Key。

## 配置步骤

### 1. 添加 MCP Server

运行以下命令（会自动写入 `~/.claude.json`）：

```bash
claude mcp add -s user MiniMax \
  --env MINIMAX_API_KEY=你的API密钥 \
  --env MINIMAX_API_HOST=https://api.minimaxi.com \
  -- uvx minimax-coding-plan-mcp -y
```

**注意**：
- 必须使用绝对路径 `/home/settle/.local/bin/uvx`（或你系统中 uvx 的实际路径）
- 直接使用 `uvx` 命令可能无法找到，应使用完整路径

### 2. 验证配置

重启 Claude Code，然后运行：

```bash
claude mcp list
```

输出中 MiniMax 显示 `✓ Connected` 即表示成功。

## 可用工具

| 工具 | 参数 | 说明 |
|------|------|------|
| `web_search` | `query` (string) | 网络搜索 |
| `understand_image` | `prompt` (string), `image_url` (string) | 图片理解，支持 HTTP URL 或本地路径，最大 20MB |
