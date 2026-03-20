---
name: create-skill
description: >-
  指导用户为 Cursor 创建高质量的 Agent Skills。当用户想新建、编写或设计一个
  skill，或者询问 skill 结构、最佳实践、SKILL.md 格式时使用。
---
# 在 Cursor 中创建技能

这个技能用于指导你为 Cursor 创建高质量的 Agent Skills。技能本质上是 Markdown 文件，用来教会 agent 如何执行特定任务，例如按团队标准审查 PR、生成指定格式的提交信息、查询数据库结构，或执行任意专业工作流。

## 开始之前：先收集需求

在创建技能之前，需要从用户那里收集以下关键信息：

1. **目的与范围**：这个技能要帮助完成什么具体任务或工作流？
2. **目标存放位置**：这是个人技能（`~/.cursor/skills/`）还是项目技能（`.cursor/skills/`）？
3. **触发场景**：agent 应该在什么情况下自动应用这个技能？
4. **关键领域知识**：这个技能需要补充哪些 agent 原本不一定知道的专业信息？
5. **输出格式偏好**：是否有指定模板、格式或风格要求？
6. **已有模式**：是否有现成示例或约定可供遵循？

### 根据上下文推断

如果你有之前的对话上下文，可以根据讨论内容推断技能方向。你可以基于对话中出现的工作流、模式或领域知识来创建技能。

### 收集更多信息

如果你还需要澄清问题，并且 `AskQuestion` 工具可用，优先使用它：

```
AskQuestion 使用示例：
- “这个技能应该存放在哪里？” 选项如 ["个人 (~/.cursor/skills/)", "项目 (.cursor/skills/)"]
- “这个技能是否应该包含可执行脚本？” 选项如 ["是", "否"]
```

如果 `AskQuestion` 不可用，就用自然对话的方式询问这些问题。

---

## 技能文件结构

### 目录布局

技能以目录形式存储，目录中必须包含一个 `SKILL.md` 文件：

```
skill-name/
├── SKILL.md              # 必需 - 主说明文件
├── reference.md          # 可选 - 详细文档
├── examples.md           # 可选 - 使用示例
└── scripts/              # 可选 - 工具脚本
    ├── validate.py
    └── helper.sh
```

### 存放位置

| 类型 | 路径 | 作用范围 |
|------|------|----------|
| Personal | ~/.cursor/skills/skill-name/ | 对你所有项目都可用 |
| Project | .cursor/skills/skill-name/ | 与仓库一起共享给其他人 |

**重要**：不要在 `~/.cursor/skills-cursor/` 中创建技能。这个目录是 Cursor 内部内置技能保留目录，由系统自动管理。

### SKILL.md 结构

每个技能都需要一个带有 YAML frontmatter 和 Markdown 正文的 `SKILL.md` 文件：

```markdown
---
name: your-skill-name
description: Brief description of what this skill does and when to use it
---

# Your Skill Name

## Instructions
Clear, step-by-step guidance for the agent.

## Examples
Concrete examples of using this skill.
```

### 必需的元数据字段

| 字段 | 要求 | 用途 |
|-------|------|------|
| `name` | 最多 64 个字符，只能包含小写字母/数字/连字符 | 技能唯一标识 |
| `description` | 最多 1024 个字符，不能为空 | 帮助 agent 判断何时应用此技能 |

---

## 如何写出高质量 description

`description` 对技能发现至关重要。agent 会根据它来决定何时使用你的技能。

### Description 最佳实践

1. **使用第三人称**（因为 description 会被注入系统提示词）：
   - ✅ 好：`Processes Excel files and generates reports`
   - ❌ 避免：`I can help you process Excel files`
   - ❌ 避免：`You can use this to process Excel files`

2. **具体明确，并包含触发词**：
   - ✅ 好：`Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.`
   - ❌ 模糊：`Helps with documents`

3. **同时包含 WHAT 和 WHEN**：
   - WHAT：这个技能做什么（具体能力）
   - WHEN：agent 应该在什么时候使用它（触发场景）

### Description 示例

```yaml
# PDF Processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Excel Analysis
description: Analyze Excel spreadsheets, create pivot tables, generate charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.

# Git Commit Helper
description: Generate descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.

# Code Review
description: Review code for quality, security, and best practices following team standards. Use when reviewing pull requests, code changes, or when the user asks for a code review.
```

---

## 核心编写原则

### 1. 简洁最重要

上下文窗口需要和对话历史、其他技能、当前请求共享。每一个 token 都在争夺空间。

**默认前提**：agent 已经足够聪明。只补充它原本不一定知道的信息。

对每一段内容都问自己：
- “agent 真的需要这段解释吗？”
- “这部分是否可以默认它已经知道？”
- “这一段是否值得它占用的上下文成本？”

**好（简洁）**：
```markdown
## Extract PDF text

Use pdfplumber for text extraction:

\`\`\`python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
\`\`\`
```

**差（冗长）**：
```markdown
## Extract PDF text

PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available for PDF processing, but we
recommend pdfplumber because it's easy to use and handles most cases well...
```

### 2. 保持 SKILL.md 少于 500 行

为了获得更好的性能，主 `SKILL.md` 文件应该尽量简洁。详细内容可通过渐进式展开提供。

### 3. 渐进式展开

把最核心的信息放在 `SKILL.md` 中；把更详细的参考资料放在单独文件中，并只在需要时读取。

```markdown
# PDF Processing

## Quick start
[Essential instructions here]

## Additional resources
- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

**引用保持一层深度**：直接从 `SKILL.md` 链接到参考文件。嵌套太深的引用可能导致只被部分读取。

### 4. 控制合适的自由度

根据任务的脆弱程度，决定说明要写得多具体：

| 自由度级别 | 适用场景 | 示例 |
|---------------|-------------|---------|
| **高**（文字说明） | 存在多种可行方案，依赖上下文判断 | 代码审查指南 |
| **中**（伪代码/模板） | 有偏好方案，但允许一定变化 | 报告生成 |
| **低**（具体脚本） | 操作脆弱，一致性要求高 | 数据库迁移 |

---

## 常见模式

### 模板模式

提供输出格式模板：

```markdown
## Report structure

Use this template:

\`\`\`markdown
# [Analysis Title]

## Executive summary
[One-paragraph overview of key findings]

## Key findings
- Finding 1 with supporting data
- Finding 2 with supporting data

## Recommendations
1. Specific actionable recommendation
2. Specific actionable recommendation
\`\`\`
```

### 示例模式

对于那些输出质量高度依赖示例的技能，可以提供示例：

```markdown
## Commit message format

**Example 1:**
Input: Added user authentication with JWT tokens
Output:
\`\`\`
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
\`\`\`

**Example 2:**
Input: Fixed bug where dates displayed incorrectly
Output:
\`\`\`
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation
\`\`\`
```

### 工作流模式

把复杂操作拆成明确步骤，并配合清单：

```markdown
## Form filling workflow

Copy this checklist and track progress:

\`\`\`
Task Progress:
- [ ] Step 1: Analyze the form
- [ ] Step 2: Create field mapping
- [ ] Step 3: Validate mapping
- [ ] Step 4: Fill the form
- [ ] Step 5: Verify output
\`\`\`

**Step 1: Analyze the form**
Run: \`python scripts/analyze_form.py input.pdf\`
...
```

### 条件分支工作流模式

通过决策点引导执行：

```markdown
## Document modification workflow

1. Determine the modification type:

   **Creating new content?** → Follow "Creation workflow" below
   **Editing existing content?** → Follow "Editing workflow" below

2. Creation workflow:
   - Use docx-js library
   - Build document from scratch
   ...
```

### 反馈回路模式

对于质量要求高的任务，引入验证闭环：

```markdown
## Document editing process

1. Make your edits
2. **Validate immediately**: \`python scripts/validate.py output/\`
3. If validation fails:
   - Review the error message
   - Fix the issues
   - Run validation again
4. **Only proceed when validation passes**
```

---

## 工具脚本

预置脚本相比临时生成代码的优势：
- 比生成代码更可靠
- 节省 token（无需把代码塞进上下文）
- 节省时间（不用每次都现写）
- 保证跨次使用的一致性

```markdown
## Utility scripts

**analyze_form.py**: Extract all form fields from PDF
\`\`\`bash
python scripts/analyze_form.py input.pdf > fields.json
\`\`\`

**validate.py**: Check for errors
\`\`\`bash
python scripts/validate.py fields.json
# Returns: "OK" or lists conflicts
\`\`\`
```

要明确说明：agent 应该**执行**这个脚本（最常见），还是只把它当作参考去**阅读**。

---

## 需要避免的反模式

### 1. Windows 风格路径
- ✅ 使用：`scripts/helper.py`
- ❌ 避免：`scripts\helper.py`

### 2. 给出过多选项
```markdown
# Bad - confusing
"You can use pypdf, or pdfplumber, or PyMuPDF, or..."

# Good - provide a default with escape hatch
"Use pdfplumber for text extraction.
For scanned PDFs requiring OCR, use pdf2image with pytesseract instead."
```

### 3. 时效性信息
```markdown
# Bad - will become outdated
"If you're doing this before August 2025, use the old API."

# Good - use an "old patterns" section
## Current method
Use the v2 API endpoint.

## Old patterns (deprecated)
<details>
<summary>Legacy v1 API</summary>
...
</details>
```

### 4. 术语不一致
全篇选用同一个术语并保持一致：
- ✅ 始终使用 `API endpoint`，不要混用 `URL`、`route`、`path`
- ✅ 始终使用 `field`，不要混用 `box`、`element`、`control`

### 5. 技能名称太模糊
- ✅ 好：`processing-pdfs`、`analyzing-spreadsheets`
- ❌ 避免：`helper`、`utils`、`tools`

---

## 技能创建工作流

当你帮助用户创建技能时，遵循以下流程：

### 阶段 1：发现需求

收集以下信息：
1. 技能的目的和主要使用场景
2. 存放位置（个人级或项目级）
3. 触发场景
4. 特定要求或约束
5. 可参考的现有示例或模式

如果可以使用 `AskQuestion` 工具，优先用它进行结构化收集；否则用自然对话方式询问。

### 阶段 2：设计

1. 起草技能名（小写、连字符、最长 64 字符）
2. 写出具体、第三人称的 description
3. 列出所需的主要章节
4. 判断是否需要额外参考文件或脚本

### 阶段 3：实现

1. 创建目录结构
2. 编写带 frontmatter 的 `SKILL.md`
3. 创建需要的参考文件
4. 如果需要，创建工具脚本

### 阶段 4：验证

1. 确认 `SKILL.md` 少于 500 行
2. 检查 description 是否具体，并包含关键触发词
3. 确保术语全篇一致
4. 确保所有文件引用只有一层深度
5. 测试技能是否能被发现并正确应用

---

## 完整示例

下面是一个结构良好的技能完整示例：

**目录结构：**
```
code-review/
├── SKILL.md
├── STANDARDS.md
└── examples.md
```

**SKILL.md：**
```markdown
---
name: code-review
description: Review code for quality, security, and maintainability following team standards. Use when reviewing pull requests, examining code changes, or when the user asks for a code review.
---

# Code Review

## Quick Start

When reviewing code:

1. Check for correctness and potential bugs
2. Verify security best practices
3. Assess code readability and maintainability
4. Ensure tests are adequate

## Review Checklist

- [ ] Logic is correct and handles edge cases
- [ ] No security vulnerabilities (SQL injection, XSS, etc.)
- [ ] Code follows project style conventions
- [ ] Functions are appropriately sized and focused
- [ ] Error handling is comprehensive
- [ ] Tests cover the changes

## Providing Feedback

Format feedback as:
- 🔴 **Critical**: Must fix before merge
- 🟡 **Suggestion**: Consider improving
- 🟢 **Nice to have**: Optional enhancement

## Additional Resources

- For detailed coding standards, see [STANDARDS.md](STANDARDS.md)
- For example reviews, see [examples.md](examples.md)
```

---

## 汇总检查清单

在最终完成一个技能前，请确认：

### 核心质量
- [ ] Description 具体且包含关键术语
- [ ] Description 同时说明 WHAT 和 WHEN
- [ ] 使用第三人称编写
- [ ] `SKILL.md` 正文少于 500 行
- [ ] 术语保持一致
- [ ] 示例具体，不要抽象空泛

### 结构
- [ ] 文件引用只有一层深度
- [ ] 合理使用渐进式展开
- [ ] 工作流步骤清晰
- [ ] 不包含容易过时的时效性信息

### 如果包含脚本
- [ ] 脚本是真正解决问题，而不是把问题甩出去
- [ ] 所需依赖包有文档说明
- [ ] 错误处理明确且有帮助
- [ ] 不使用 Windows 风格路径
