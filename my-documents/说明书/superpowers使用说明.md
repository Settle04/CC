# Superpowers 使用说明

## 概述

Superpowers 是一个 Claude Code 插件，包含多个技能（skills），在创意工作前必须使用 brainstorming，避免盲目实现。

## 安装状态

已成功安装并加载：
- 2 个插件
- 5 个技能
- 6 个 agents
- 1 个 hook

## 可用技能列表

### 核心技能

| 技能名 | 触发命令 | 用途 |
|--------|----------|------|
| brainstorming | `/superpowers:brainstorming` | **任何创意工作前必须使用** — 探索意图、需求和设计后再实现 |
| writing-plans | `/superpowers:writing-plans` | 有规范文档或多步骤任务时，在触碰代码前使用 |
| executing-plans | `/superpowers:executing-plans` | 有书面实施计划时，在单独会话中执行并有检查点 |
| systematic-debugging | `/superpowers:systematic-debugging` | 遇到任何 bug、测试失败或异常行为时使用 |
| verification-before-completion | `/superpowers:verification-before-completion` | 声称工作完成前，运行验证命令并确认输出 |
| requesting-code-review | `/superpowers:requesting-code-review` | 完成任务、实现主要功能或合并前验证 |
| finishing-a-development-branch | `/superpowers:finishing-a-development-branch` | 实现完成、测试通过后决定如何集成 |
| test-driven-development | `/superpowers:test-driven-development` | 实现任何功能或修复时，编写实现代码前使用 |
| receiving-code-review | `/superpowers:receiving-code-review` | 收到代码审查反馈时，验证建议而非盲目实现 |

### 特殊技能

| 技能名 | 触发命令 | 用途 |
|--------|----------|------|
| using-git-worktrees | `/superpowers:using-git-worktrees` | 需要隔离工作区或执行实施计划时使用 |
| subagent-driven-development | `/superpowers:subagent-driven-development` | 在当前会话中执行有独立任务的实施计划 |
| writing-skills | `/superpowers:writing-skills` | 创建新技能、编辑现有技能或验证技能部署前 |
| dispatching-parallel-agents | `/superpowers:dispatching-parallel-agents` | 面对2+个独立任务且无共享状态或顺序依赖时 |

## 常用工作流

### 创意功能开发
1. `/superpowers:brainstorming` — 探索需求和设计
2. `/superpowers:writing-plans` — 制定实施计划
3. 编写代码
4. `/superpowers:verification-before-completion` — 验证完成

### Bug 修复
1. `/superpowers:systematic-debugging` — 系统性调试
2. 定位问题
3. 修复
4. `/superpowers:verification-before-completion` — 验证修复

### 代码审查
1. 完成实现后 `/superpowers:requesting-code-review` — 请求审查
2. 收到反馈后 `/superpowers:receiving-code-review` — 处理反馈

### 分支完成
1. 功能实现 + 测试通过后 `/superpowers:finishing-a-development-branch` — 决定合并方式

## 使用示例

```
/superpowers:brainstorming
```

输入你的想法，技能会引导你完成需求的探索和设计，再进入实现阶段。

## 关键原则

> **任何创意工作（创建功能、构建组件、添加功能、修改行为）前，必须先使用 brainstorming skill。**

这避免了盲目实现，确保在动手前理解清楚要做什么和为什么做。