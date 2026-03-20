---
name: find-skills
description: 当用户提出“如何做 X”“帮我找一个做 X 的技能”“有没有能做这个的 skill”这类问题，或表达想扩展能力时，帮助用户发现并安装 agent skills。当用户正在寻找某种可能以可安装技能形式存在的功能时，应使用这个技能。
---

# 查找技能

这个技能帮助你从开放的 agent skills 生态中发现并安装技能。

## 何时使用这个技能

当用户出现以下情况时，使用这个技能：

- 询问“我该怎么做 X”，且 X 可能是某个已有技能覆盖的常见任务
- 直接说“帮我找一个做 X 的技能”或“有没有做 X 的技能”
- 询问“你能做 X 吗”，且 X 属于专业能力
- 表达想扩展 agent 能力的意图
- 想搜索工具、模板或工作流
- 提到自己希望在某个特定领域获得帮助，例如设计、测试、部署等

## 什么是 Skills CLI？

Skills CLI（`npx skills`）是开放 agent skills 生态的包管理工具。技能是模块化的软件包，通过专业知识、工作流和工具来扩展 agent 的能力。

**常用命令：**

- `npx skills find [query]` - 交互式或按关键词搜索技能
- `npx skills add <package>` - 从 GitHub 或其他来源安装技能
- `npx skills check` - 检查技能更新
- `npx skills update` - 更新所有已安装技能

**浏览技能：** https://skills.sh/

## 如何帮助用户查找技能

### 第 1 步：理解用户需求

当用户就某件事请求帮助时，先识别：

1. 所属领域，例如 React、测试、设计、部署
2. 具体任务，例如编写测试、制作动画、审查 PR
3. 这是否属于一个足够常见、很可能已经有现成技能的任务

### 第 2 步：搜索技能

使用相关查询词运行 `find` 命令：

```bash
npx skills find [query]
```

例如：

- 用户问“怎么让我的 React 应用更快？” → `npx skills find react performance`
- 用户问“你能帮我做 PR review 吗？” → `npx skills find pr review`
- 用户问“我需要生成 changelog” → `npx skills find changelog`

命令返回结果通常类似这样：

```
Install with npx skills add <owner/repo@skill>

vercel-labs/agent-skills@vercel-react-best-practices
└ https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### 第 3 步：把候选结果展示给用户

找到相关技能后，向用户展示以下内容：

1. 技能名称以及它的用途
2. 用户可执行的安装命令
3. 指向 `skills.sh` 的详情链接

示例回复：

```
我找到一个可能有帮助的技能！`vercel-react-best-practices` 提供了
来自 Vercel Engineering 的 React 和 Next.js 性能优化指南。

安装命令：
npx skills add vercel-labs/agent-skills@vercel-react-best-practices

了解更多：https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### 第 4 步：询问是否需要安装

如果用户希望继续，你可以帮他安装该技能：

```bash
npx skills add <owner/repo@skill> -g -y
```

其中 `-g` 表示全局安装（用户级），`-y` 表示跳过确认提示。

## 常见技能分类

搜索时可以优先考虑这些常见分类：

| Category        | Example Queries                          |
| --------------- | ---------------------------------------- |
| Web Development | react, nextjs, typescript, css, tailwind |
| Testing         | testing, jest, playwright, e2e           |
| DevOps          | deploy, docker, kubernetes, ci-cd        |
| Documentation   | docs, readme, changelog, api-docs        |
| Code Quality    | review, lint, refactor, best-practices   |
| Design          | ui, ux, design-system, accessibility     |
| Productivity    | workflow, automation, git                |

## 提高搜索效果的技巧

1. **使用更具体的关键词**：`react testing` 比单独用 `testing` 更好
2. **尝试同义词**：如果 `deploy` 没结果，可以试 `deployment` 或 `ci-cd`
3. **优先查看热门来源**：很多技能来自 `vercel-labs/agent-skills` 或 `ComposioHQ/awesome-claude-skills`

## 当没有找到相关技能时

如果没有找到合适技能：

1. 明确告知当前没有找到现成技能
2. 表示你仍然可以用通用能力直接帮助完成任务
3. 建议用户使用 `npx skills init` 自己创建技能

示例：

```
我搜索了和 “xyz” 相关的技能，但没有找到匹配项。
不过我仍然可以直接帮你处理这个任务！要我继续吗？

如果这是你经常做的事情，也可以自己创建一个技能：
npx skills init my-xyz-skill
```
