# Brave Search API / MCP

调查日期：2026-05-04
来源：https://brave.com/search/api/ → Dashboard: https://api-dashboard.search.brave.com

---

## 定价计划（均需绑卡订阅）

| 计划 | 价格 | 每月 $5 免费额度可覆盖的量 | 速率限制 |
|------|------|---------------------------|---------|
| **Search** | $5/1,000 次请求 | 1,000 次搜索/月 | 50 req/s |
| **Answers** | $4/1,000 查询 + token | ~1,000 查询/月 | 2 req/s |
| **Spellcheck** | $5/10,000 次请求 | 10,000 次/月 | 100 req/s |
| **Autosuggest** | $5/10,000 次请求 | 10,000 次/月 | 100 req/s |
| **Enterprise** | 定制 | — | 定制 |

所有计划均包含 **每月 $5 免费额度**，自动抵扣，当月有效不累积。

## 免费使用的策略

没有纯免费套餐（不绑卡的那种）。策略是：

1. 订阅最低 $5 的 **Search 计划**（需绑卡）
2. 每月 $5 免费额度覆盖 1,000 次搜索请求
3. 只要不超出 $5/月就不会产生额外费用

## Brave Search MCP (Skills)

官方 Agent Skills 仓库：https://github.com/brave/brave-search-skills

支持 Claude Code、Cursor、Copilot、Codex、Windsurf、OpenClaw 等。

### 在 Claude Code 中安装

```
/plugin marketplace add brave/brave-search-skills
/plugin install brave-search-skills@brave-search
```

### 配置 API Key

在 `~/.claude/settings.json` 或 `.claude/settings.local.json` 中：

```json
{
  "env": {
    "BRAVE_SEARCH_API_KEY": "your-key"
  }
}
```

### 可用 Skills

| Skill | 用途 |
|-------|------|
| llm-context | LLM 增强搜索（推荐） |
| web-search | 通用网页搜索 |
| images-search | 图片搜索 |
| news-search | 新闻搜索 |
| videos-search | 视频搜索 |
| answers | AI 生成答案 |
| suggest | 搜索建议 |
| spellcheck | 拼写检查 |

## 当前账号状态

- 已注册账号，已登录
- 无活跃订阅
- 无 API Key 生成
- 使用量为 0

## 下一步

1. 订阅 Search 计划（绑卡）
2. 生成 API Key
3. 安装 Brave Search Skills 到 Claude Code
4. 每月免费使用 1,000 次搜索
