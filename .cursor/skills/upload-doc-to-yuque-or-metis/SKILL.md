---
name: upload-doc-to-yuque-or-metis
description: 帮助用户上传文档到语雀知识库，更新已有文档，并将文档链接同步到metis项目管理平台。当用户需要上传文档到语雀、更新语雀文档、将文档链接上传到metis、或进行文档管理操作时使用此技能。
---

# 上传文档到语雀和Metis

## 前置条件检查

在执行任何操作前，**必须**检查以下条件：

1. **检查MCP工具是否激活**：
   - 通过 `<mcp_file_system>` 检查是否存在 `ph-yuque-mcp-tool` 相关的 MCP 服务器
   - 或直接尝试调用工具来验证可用性
   - 如果未激活，引导用户安装并激活

2. **检查知识库链接**（仅上传新文档时需要）：
   - 尝试调用 `create_doc` 工具
   - 如果工具提示需要知识库链接，向用户询问目标知识库
   - 询问用户是否需要将该知识库设置为默认配置

## 工作流程

### 1. 上传新文档

当用户需要上传新文档到语雀时：

**检查清单**：
- [ ] 确认 ph-yuque-mcp-tool 已激活（通过 MCP 文件系统检查）
- [ ] 准备要上传的文档内容
- [ ] 准备知识库链接（如果工具需要）

**执行步骤**：

1. **知识库检查**：
   ```
   如果工具提示需要知识库链接：
     → 询问用户："请提供目标知识库链接"
     → 接受的链接格式：
        - https://hellobike.yuque.com/qsi4ef/bb7o88
        - https://hellobike.yuque.com/qsi4ef/bb7o88/ezbsaed8b7n02ggz
     → 建议用户将此知识库设置为默认配置以简化后续操作
     → 如果用户同意配置：
        - 读取 ~/.cursor/mcp.json 文件
        - 在 ph-yuque-mcp-tool 的 env 中添加或更新 DEFAULT_BOOK_SLUG_URL
        - 将用户提供的知识库链接写入配置
        - 保存文件并提醒用户需要重启 Cursor 使配置生效
   ```

2. **上传文档**：
   ```
   使用工具：ph-yuque-mcp-tool 的 create_doc
   
   操作说明：
   - 此操作会在语雀知识库中创建新的文档副本
   - 成功后会返回新创建文档的链接
   - 保存返回的文档链接供后续使用
   ```

3. **确认结果**：
   - 向用户展示新创建的文档链接
   - 询问是否需要将链接同步到metis

### 2. 更新已有文档

当用户需要更新语雀中已存在的文档时：

**检查清单**：
- [ ] 确认 ph-yuque-mcp-tool 已激活（通过 MCP 文件系统检查）
- [ ] 获取要更新的文档链接
- [ ] 准备更新的内容

**执行步骤**：

1. **获取文档信息**：
   ```
   必需信息：
   - 文档链接（用户提供或从上下文获取）
   - 更新的内容
   ```

2. **执行更新**：
   ```
   使用工具：ph-yuque-mcp-tool 的 update_doc
   
   入参：
   - 文档链接：要更新的语雀文档URL
   - 更新内容：新的文档内容
   
   注意：
   - 此操作会**完全覆盖**原有文档内容
   - 建议在更新前确认用户了解覆盖的影响
   ```

3. **确认结果**：
   - 告知用户文档已成功更新
   - 询问是否需要将更新后的链接同步到metis

### 3. 上传链接到Metis

当用户需要将语雀文档链接同步到metis项目管理平台时：

**检查清单**：
- [ ] 确认 ph-yuque-mcp-tool 已激活（通过 MCP 文件系统检查）
- [ ] 获取要上传的语雀文档链接
- [ ] 确认 Metis ID（必填）
- [ ] 确定技术方案类型（必填）

**执行步骤**：

1. **准备语雀链接**：
   ```
   链接来源：
   - 刚上传或更新的文档链接
   - 用户直接提供的语雀链接
   ```

2. **获取 Metis ID**：
   ```
   必需参数：Metis ID
   格式：PROJECT-NUMBER，例如 USERGROWTH-10547
   
   如果用户未提供：
   → 询问用户："请提供 Metis ID（格式如：USERGROWTH-10547）"
   → 等待用户提供后再继续
   ```

3. **确定技术方案类型**：
   ```
   步骤：
   1. 如果能访问文档内容，根据文档内容推测技术方案类型：
      - 前端/Web相关文档 → "frontTechSolution" (前端技术方案)
      - 后端/服务端/API文档 → "serviceTechSolution" (服务端技术方案)
      - Android相关文档 → "androidTechSolution" (Android 技术方案)
      - iOS相关文档 → "iosTechSolution" (iOS 技术方案)
      - React Native/RN文档 → "rnTechSolution" (RN 技术方案)
   
   2. **无论是否推测出来，都必须向用户确认**：
      如果推测出来：
        → "根据文档内容，我推测这是【推测的类型】，对吗？"
      如果无法推测：
        → "请告诉我这个文档的技术方案类型：
           - 前端技术方案 (frontTechSolution)
           - 服务端技术方案 (serviceTechSolution)
           - Android 技术方案 (androidTechSolution)
           - iOS 技术方案 (iosTechSolution)
           - RN 技术方案 (rnTechSolution)"
   
   3. 等待用户确认或纠正后再继续
   ```

4. **上传到Metis**：
   ```
   使用工具：ph-yuque-mcp-tool 的 upload_yuque_to_metis
   
   入参：
   - metisKey: Metis ID（格式：PROJECT-NUMBER）
   - 根据技术方案类型选择对应的参数：
     * frontTechSolution: 前端技术方案链接
     * serviceTechSolution: 服务端技术方案链接
     * androidTechSolution: Android 技术方案链接
     * iosTechSolution: iOS 技术方案链接
     * rnTechSolution: RN 技术方案链接
   
   操作说明：
   - 根据用户确认的类型，将语雀文档链接传入对应的参数
   - 例如：用户确认是"前端技术方案"，则传入 frontTechSolution 参数
   - 可以一次传入多种类型的链接，但通常每次只上传一种
   - 此工具会将文档链接同步到metis平台对应的字段
   - 注意：每次调用会覆盖相关字段，空值不会覆盖
   - 成功后会返回metis中的对应条目信息
   ```

5. **确认结果**：
   - 向用户确认链接已成功同步到metis
   - 展示metis中的相关信息（如果有返回）
   - 显示使用的 Metis ID 和技术方案类型

## 完整工作流示例

### 场景一：上传新文档并同步到Metis

```
1. 检查 ph-yuque-mcp-tool 是否激活（通过 MCP 文件系统）
2. 尝试使用 create_doc 上传文档
   - 如果工具提示需要知识库链接：询问用户提供
3. 保存返回的文档链接
5. 询问用户是否要同步到metis
   - 如果是：
     a. 确认用户是否提供了 Metis ID
        - 如未提供：询问 Metis ID
     b. 根据文档内容推测技术方案类型（前端/服务端/Android/iOS/RN）
     c. 向用户确认技术方案类型
     d. 使用 upload_yuque_to_metis 上传链接（根据类型使用对应的参数名）
6. 向用户确认所有操作完成
```

### 场景二：更新文档并同步到Metis

```
1. 检查 ph-yuque-mcp-tool 是否激活（通过 MCP 文件系统）
2. 获取要更新的文档链接
3. 提醒用户更新操作会覆盖原有内容
4. 使用 update_doc 更新文档
5. 询问用户是否要同步到metis
   - 如果是：
     a. 确认用户是否提供了 Metis ID
        - 如未提供：询问 Metis ID
     b. 根据文档内容推测技术方案类型（前端/服务端/Android/iOS/RN）
     c. 向用户确认技术方案类型
     d. 使用 upload_yuque_to_metis 上传链接（根据类型使用对应的参数名）
6. 向用户确认所有操作完成
```

### 场景三：仅上传链接到Metis

```
1. 检查 ph-yuque-mcp-tool 是否激活（通过 MCP 文件系统）
2. 获取语雀文档链接（用户提供）
3. 确认用户是否提供了 Metis ID
   - 如未提供：询问 Metis ID
4. 尝试获取文档内容并推测技术方案类型（前端/服务端/Android/iOS/RN）
5. 向用户确认技术方案类型（无论是否推测出）
6. 使用 upload_yuque_to_metis 上传链接（根据类型使用对应的参数名）
7. 向用户确认操作完成
```

## 错误处理

### 工具未激活

如果 `ph-yuque-mcp-tool` 未激活：
```
错误提示：
"检测到 ph-yuque-mcp-tool 工具未激活。

请按以下步骤安装并激活：
1. 访问 MCP 市场：https://fat-ph-ai-data.hellobike.cn/#/mcp-market
2. 搜索并下载 ph-yuque-mcp-tool
3. 按照页面指引完成配置
4. 重启 Cursor 后工具将自动激活

或者，您也可以手动在 ~/.cursor/mcp.json 中配置此工具（参考配置示例），配置后需要重启 Cursor。"
```

### 需要提供知识库链接

如果工具提示需要知识库链接：
```
询问用户：
"请提供目标知识库链接，格式如下：
- 知识库链接：https://hellobike.yuque.com/qsi4ef/bb7o88/qmdo4x
- 或文档链接：https://hellobike.yuque.com/qsi4ef/bb7o88/ezbsaed8b7n02ggz

建议：我可以帮您将这个知识库链接设置为默认配置，下次就不需要再输入了。
是否需要我帮您配置？（需要重启 Cursor 生效）"

如果用户同意配置：
1. 读取 ~/.cursor/mcp.json 文件
2. 在 ph-yuque-mcp-tool 的 env 中添加或更新 DEFAULT_BOOK_SLUG_URL
3. 保存文件
4. 提醒用户："配置已更新，请重启 Cursor 使配置生效"
```

### 缺少 Metis ID

如果上传到 metis 时用户未提供 Metis ID：
```
询问用户：
"上传到 metis 需要提供 Metis ID。
请提供 Metis ID（格式如：USERGROWTH-10547）"

等待用户提供后再继续执行上传操作。
```

### 无法确定技术方案类型

如果无法从文档内容推测技术方案类型：
```
询问用户：
"请告诉我这个文档的技术方案类型。
可选类型包括：
- 前端技术方案 (frontTechSolution)
- 服务端技术方案 (serviceTechSolution)
- Android 技术方案 (androidTechSolution)
- iOS 技术方案 (iosTechSolution)
- RN 技术方案 (rnTechSolution)

请选择适合的类型。"
```

### 操作失败

如果任何操作失败：
```
1. 向用户清晰说明失败的操作和原因
2. 提供可能的解决方案
3. 询问是否需要重试或采取其他操作
```

## 配置示例

### ~/.cursor/mcp.json 配置参考

```json
{
  "mcpServers": {
    "ph-yuque-mcp-tool": {
      "command": "npx",
      "args": ["-y", "@hb/ph-yuque-mcp-tool@latest"],
      "env": {
        "ACCESS_KEY": "your-access-key-here",
        "DEFAULT_BOOK_SLUG_URL": "https://hellobike.yuque.com/qsi4ef/bb7o88"
      }
    }
  }
}
```

**配置说明**：
- `ACCESS_KEY`：必填，用于访问语雀API的密钥
- `DEFAULT_BOOK_SLUG_URL`：可选，默认知识库链接，配置后可省略每次输入

## 最佳实践

1. **上传前确认**：在上传或更新文档前，向用户确认操作
2. **保存链接**：上传新文档后立即保存返回的链接
3. **提示覆盖**：更新文档时明确提醒会覆盖原有内容
4. **批量操作**：如果用户有多个文档要处理，可以逐个处理并记录进度
5. **主动配置**：当工具提示需要知识库链接时，主动询问用户是否需要帮助配置默认值
6. **智能推测**：上传到 metis 时，尝试根据文档内容推测技术方案类型，但务必向用户确认
7. **参数检查**：上传到 metis 前，确保已获取必需的 Metis ID 和技术方案类型

## 常见问题

**Q: 如何知道文档上传成功？**
A: create_doc 工具会返回新创建文档的链接，成功时会显示该链接。

**Q: 更新文档会保留版本历史吗？**
A: 语雀平台会保留版本历史，但update_doc操作会完全覆盖当前内容。

**Q: 可以批量上传文档到metis吗？**
A: 可以，逐个调用 upload_yuque_to_metis 处理每个链接。

**Q: 如果知识库链接格式不对怎么办？**
A: 工具应该能识别两种格式（知识库链接和文档链接），如果都不对会报错提示。

**Q: 配置了默认知识库后可以临时使用其他知识库吗？**
A: 可以，在上传时提供新的知识库链接即可。同时可以询问用户是否需要更新默认配置。

**Q: Metis ID 是什么？在哪里获取？**
A: Metis ID 是项目管理平台中的任务/需求编号，格式如 USERGROWTH-10547。用户需要从 metis 平台上获取并提供。

**Q: 技术方案类型有哪些选项？**
A: 支持5种类型：
- frontTechSolution (前端技术方案)
- serviceTechSolution (服务端技术方案)
- androidTechSolution (Android 技术方案)
- iosTechSolution (iOS 技术方案)
- rnTechSolution (RN 技术方案)
可以根据文档内容推测，但必须向用户确认。

**Q: 如果推测的技术方案类型不对怎么办？**
A: 没关系，正因如此才需要向用户确认。用户会纠正推测错误的类型，使用用户确认后的类型即可。注意确认后要使用正确的参数名（如 frontTechSolution、serviceTechSolution 等）调用工具。

**Q: 为什么无论是否推测出技术方案类型都要向用户确认？**
A: 因为技术方案类型会影响 metis 中的分类和展示，需要确保准确性。即使推测正确，用户确认也能避免错误。

**Q: 如何根据用户确认的类型调用工具？**
A: 根据用户确认的类型，使用对应的参数名传递语雀链接：
- "前端技术方案" → 使用 frontTechSolution 参数
- "服务端技术方案" → 使用 serviceTechSolution 参数
- "Android 技术方案" → 使用 androidTechSolution 参数
- "iOS 技术方案" → 使用 iosTechSolution 参数
- "RN 技术方案" → 使用 rnTechSolution 参数

**Q: 一次可以上传多种类型的技术方案吗？**
A: 工具支持一次传入多种类型的链接，但通常情况下，一个文档对应一种技术方案类型。如果用户明确要求上传多个类型，可以同时传入多个参数。每次调用会覆盖对应的字段，空值不会覆盖原有内容。
