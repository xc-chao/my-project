---
name: publish-fat
description: 发布当前项目到 FAT 环境。用户提到 发布fat环境、发布到fat环境、发布fat、fat发布、发布 FAT 等场景时使用。发布前检查 git status，并通过 AskQuestion 以可点击选项卡的方式确认是否提交、是否 push、是否继续发布，然后调用 build_web_app 发布到 fat。
---

# 发布 FAT

## 快速开始

- 完整流程请按 [publish.md](publish.md) 执行。
- 开始前必须先检查当前分支和 `git status`。
- 涉及确认时，优先使用 `AskQuestion` 提供可点击选项卡，不要让用户手动输入“是/否”。
- 未经用户明确确认，不得执行 `git push`。
- 调用 `build_web_app` 前，必须先读取 deploy MCP 的工具描述。
- 如果 MCP 因配置或协议异常导致调用失败，必须说明阻塞原因，不能假装发布成功。
