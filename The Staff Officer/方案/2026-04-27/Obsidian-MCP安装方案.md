# Obsidian MCP 安装方案

> 更新日期：2026-04-27
> 信息来源：GitHub jacksteamdev/obsidian-mcp-tools, CSDN, Smithery

---

## 方案概述

为 Claude Code 安装 Obsidian MCP，实现对知识库的读写、搜索和管理。

---

## 方案一：jacksteamdev/obsidian-mcp-tools（功能最全）

### ⚠️ 重要提示
该项目正在**招募新维护者**，长期维护可能存在风险。建议关注项目动态。

### 原理

分两部分：
- **Obsidian 插件**：装在 Obsidian 里，负责暴露 API 能力
- **本地 MCP 服务器**：装在 Claude Code 这边，通过 API Key 与插件通信

### 安装步骤

#### 第一步：在 Obsidian 中安装插件

1. 打开 Obsidian → 设置 → 社区插件
2. 关闭安全模式
3. 搜索并安装 **"MCP Tools"**（by jacksteamdev）
   - 若搜不到，需先安装 **BRAT** 插件（社区插件，搜索"BRAT"安装）
   - 装好 BRAT 后 → 社区插件 → BRAT 设置 → "Add Beta plugin" → 输入：
     ```
     https://github.com/jacksteamdev/obsidian-mcp-tools
     ```
4. 启用 MCP Tools 插件
5. 进入插件设置，复制 **API Key**

#### 第二步：在 Claude Code 侧配置 MCP 服务器

在你的 MCP 配置文件（`~/.claude/mcp.json` 或通过 `claude mcp add` 命令）添加：

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "uvx",
      "args": ["mcp-obsidian"],
      "env": {
        "OBSIDIAN_API_KEY": "<你从插件设置里复制的KEY>",
        "OBSIDIAN_VAULT_PATH": "/home/settle/projects/助手"
      }
    }
  }
}
```

#### 第三步：验证

```bash
claude mcp list
```

确认 obsidian MCP 显示为 Connected。

---

## 方案二：mcp-obsidian（轻量替代）

基于 Python 的 MCP 服务器，通过 Obsidian REST API 插件通信。

### 安装步骤

#### 第一步：安装 Obsidian REST API 插件

1. 打开 Obsidian → 设置 → 社区插件
2. 搜索并安装 **"REST API"** 插件
3. 启用插件，获取 API Key 和端口（默认 1978）

#### 第二步：安装并配置 mcp-obsidian

```bash
uvx mcp-obsidian
```

配置文件：

```json
{
  "mcpServers": {
    "mcp-obsidian": {
      "command": "uvx",
      "args": ["mcp-obsidian"],
      "env": {
        "OBSIDIAN_API_KEY": "<YOUR_OBSIDIAN_API_KEY>"
      }
    }
  }
}
```

---

## 方案三：Smithery 一键安装（Claude Desktop 用户推荐）

适合不想手动配置的用户：

```bash
npx -y @smithery/cli install mcp-obsidian --client claude
```

安装完成后重启 Claude Desktop 即可。

---

## 方案对比

| 方案 | 复杂度 | 功能 | 维护状态 |
|------|--------|------|----------|
| jacksteamdev/obsidian-mcp-tools | 中 | 最全 | ⚠️ 招募维护者 |
| mcp-obsidian + REST API | 低 | 基础读写 | 活跃 |
| Smithery 一键安装 | 低 | 基础 | 活跃 |

---

## 推荐

**优先尝试方案二（mcp-obsidian + REST API）**：
- 插件更轻量，REST API 插件社区活跃
- mcp-obsidian 有持续更新
- 如果功能不够，再换方案一

---

## 风险提示

- MCP 服务器能读写你的整个 Obsidian 金库，确认 API Key 不要泄露
- 确保 Obsidian 在运行，MCP 服务器需要和 Obsidian 插件通信
- 你的知识库路径 `/home/settle/projects/助手` 需要在配置中正确指定
- jacksteamdev 方案长期维护有不确定性，建议关注项目 GitHub 页面的最新动态
