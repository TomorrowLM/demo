# Swagger MCP 工具改进计划

## 概述

基于用户需求“通过具体接口的 Swagger URL 直接获取接口文档内容”，我们对现有工具 `swagger_get_model` 进行了分析和测试。测试结果表明，**工具已具备该能力**，能够成功解析 Swagger UI 页面 URL 中的片段（fragment），自动推断出 Swagger JSON 文档地址，并匹配对应的操作（operation）返回其请求/响应模型。

**测试用例**：
- URL：`https://apit-dsb.dingtax.cn/dsb/yqarw/api/doc.html#/%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86/%E4%B8%80%E8%B5%B7%E5%AE%89-common/aiDetectRiskConfirmUsingPOST`
- 结果：成功返回操作详情、路径参数、响应模型（`Result«YqaRiskCategoryGenResp»`）。

## 当前实现分析

### 核心流程
1. **URL 解析**：从 `source` 参数中提取 fragment，解码后得到操作标识（如 `aiDetectRiskConfirmUsingPOST`）。
2. **文档加载**：若 URL 为 Swagger UI 页面（`doc.html` 或 `swagger-ui.html`），工具尝试通过常见端点（`/v3/api-docs`、`/v2/api-docs`、`/swagger-resources`）获取实际的 Swagger JSON 文档。
3. **操作匹配**：使用 `findOperationByKeyword` 在文档的 paths 中搜索匹配的操作（基于 operationId、summary、tags、path 等）。
4. **模型提取**：通过 `extractOperationIO` 提取操作的请求体、参数和响应体 schema。
5. **引用解析**：若 `resolveRefs` 为 true，递归解析 `$ref` 引用。

### 优点
- 支持 OpenAPI 3.x 和 Swagger 2.0。
- 自动处理 Swagger UI 页面到 JSON 文档的转换。
- 提供模糊匹配，即使操作标识不完全准确也能找到近似操作。

## 识别的问题与限制

### 1. Swagger JSON 文档地址推断不够健壮
- **问题**：当前推断逻辑仅尝试三种标准端点，若后端 Swagger 配置使用了非标准路径（如 `/api/swagger.json`、`/docs/api-docs`）则无法找到文档。
- **影响**：导致工具无法获取任何模型，返回错误“无法从该 URL 获取可解析的 Swagger/OpenAPI JSON”。

### 2. 操作匹配可能不精确
- **问题**：`findOperationByKeyword` 使用简单的字符串包含匹配，并赋予 summary、operationId、path 不同权重。当多个操作包含相同关键词时，可能返回错误操作。
- **影响**：返回的接口文档可能不是用户期望的那个。

### 3. 错误信息对用户不友好
- **问题**：当推断失败或匹配失败时，错误信息较为技术化，未给出明确的解决建议（如“请直接提供 JSON 文档地址”）。
- **影响**：用户难以自行排查问题。

### 4. 网络请求缺乏超时与重试
- **问题**：`fetch` 请求使用默认超时，在慢速网络或服务不可用时可能长时间阻塞，且无重试机制。
- **影响**：工具响应慢，用户体验差。

### 5. 缺少缓存机制
- **问题**：每次调用都会重新获取 Swagger JSON 文档，即使同一文档被多次请求。
- **影响**：增加服务端负载，降低响应速度。

### 6. 对非标准 Swagger UI 变体支持有限
- **问题**：某些 Swagger UI 版本可能使用不同的 HTML 结构或配置，工具无法从中提取 JSON 端点。
- **影响**：工具仅能覆盖部分 Swagger 部署场景。

## 改进建议

### 高优先级（直接影响功能可用性）

#### 1.1 增强 Swagger JSON 文档地址推断
- **描述**：扩展候选端点列表，并尝试从 Swagger UI 页面 HTML 中解析 `swagger-ui-config` 或 `swagger.json` 链接。
- **实施步骤**：
  1. 在 `loadDocument` 函数中增加更多常见端点模式（如 `/api-docs`、`/swagger.json`、`/openapi.json`）。
  2. 若上述端点均失败，尝试 fetch Swagger UI 页面 HTML，使用正则表达式提取 `url` 或 `spec` 配置项。
  3. 若仍无法获取，返回更详细的错误信息，提示用户手动提供 JSON 文档地址。
- **预期效果**：显著提高对非标准 Swagger 部署的支持率。

#### 1.2 改进操作匹配算法
- **描述**：优先精确匹配 operationId，其次匹配 path + method，最后才使用模糊关键词匹配。
- **实施步骤**：
  1. 修改 `findOperationByKeyword`，首先尝试 exact match on operationId（忽略大小写）。
  2. 若未找到，尝试匹配 path（将 fragment 中的路径部分与 API path 进行相似度比较）。
  3. 若仍无结果，再使用现有的模糊匹配逻辑，但提高 operationId 和 summary 的权重。
  4. 返回多个候选时，提供 confidence score 并在日志中提示。
- **预期效果**：提升匹配准确率，减少误匹配。

#### 1.3 优化错误信息与用户引导
- **描述**：为常见错误场景提供友好的错误消息和解决建议。
- **实施步骤**：
  1. 在 `loadDocument` 和 `findOperationByKeyword` 中添加错误分类。
  2. 根据错误类型返回不同的提示（例如“无法找到 Swagger JSON 文档，请检查 URL 是否指向 Swagger UI 页面，或直接提供 /v3/api-docs 地址”）。
  3. 在返回的 JSON 中增加 `hint` 字段，给出可能的下一步操作。
- **预期效果**：用户更容易理解失败原因并采取纠正措施。

### 中优先级（提升健壮性与性能）

#### 2.1 增加网络请求超时与重试
- **描述**：为 `fetch` 请求设置合理超时（如 10 秒），并在失败时自动重试（最多 2 次）。
- **实施步骤**：
  1. 在 `tryFetchJson` 中使用 `AbortController` 实现超时。
  2. 封装一个带重试的 fetch 辅助函数。
  3. 记录重试日志，避免对用户透明。
- **预期效果**：提升工具在弱网络环境下的可用性。

#### 2.2 引入内存缓存
- **描述**：对同一 URL 的 Swagger JSON 文档进行短期缓存（例如 5 分钟），减少重复请求。
- **实施步骤**：
  1. 在 `loadDocument` 中添加一个简单的内存缓存（Map），键为 normalized source URL。
  2. 缓存有效期内直接返回缓存结果。
  3. 可考虑提供 `noCache` 参数让用户跳过缓存。
- **预期效果**：降低服务端负载，加快重复请求的响应速度。

### 低优先级（扩展功能与维护性）

#### 3.1 支持更多 Swagger UI 变体
- **描述**：研究常见 Swagger UI 部署模式（如 Spring Boot Actuator、Swagger UI 静态文件等），增加对应的推断逻辑。
- **实施步骤**：
  1. 收集典型 Swagger UI 部署的样例 URL 和 JSON 端点规律。
  2. 在 `loadDocument` 中添加针对这些模式的特例处理。
  3. 可考虑允许用户通过参数指定 JSON 端点模式。
- **预期效果**：扩大工具适用范围。

#### 3.2 增加单元测试与集成测试
- **描述**：编写测试用例覆盖各种 URL 模式、匹配场景和错误处理。
- **实施步骤**：
  1. 使用 Jest 或类似框架为 `loadDocument`、`findOperationByKeyword`、`extractOperationIO` 编写单元测试。
  2. 创建集成测试，模拟真实 Swagger 服务（可使用 mock server）。
  3. 将测试加入 CI/CD 流程。
- **预期效果**：确保代码修改不会破坏现有功能，提高维护性。

#### 3.3 更新文档与示例
- **描述**：更新 `README.md`，明确说明如何通过具体接口 URL 获取文档，并提供更多示例。
- **实施步骤**：
  1. 在 `ai/mcp/src/tools/swagger/README.md` 中添加“使用具体接口 URL”章节。
  2. 提供多个成功和失败的调用示例。
  3. 说明工具的限制和常见问题排查方法。
- **预期效果**：帮助用户更好地使用工具。

## 实施路线图

建议按以下顺序实施改进：

1. **第一阶段（高优先级）**：
   - 改进错误信息与用户引导（1.3）
   - 增强 Swagger JSON 文档地址推断（1.1）
   - 改进操作匹配算法（1.2）

2. **第二阶段（中优先级）**：
   - 增加网络请求超时与重试（2.1）
   - 引入内存缓存（2.2）

3. **第三阶段（低优先级）**：
   - 支持更多 Swagger UI 变体（3.1）
   - 增加单元测试与集成测试（3.2）
   - 更新文档与示例（3.3）

## 风险评估与缓解措施

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 改进后的推断逻辑可能意外破坏现有可用 URL | 高 | 在修改前收集一批现有可用 URL 作为回归测试集，确保修改后这些 URL 仍能工作。 |
| 操作匹配算法变更导致匹配结果变化 | 中 | 保留旧算法作为 fallback，并通过配置参数允许用户选择匹配策略。 |
| 网络请求超时设置过短导致合法请求失败 | 低 | 将超时设置为可配置参数（默认 10 秒），并在错误信息中提示用户调整。 |
| 缓存可能导致文档更新延迟 | 低 | 缓存时间设为较短（5 分钟），并提供 `noCache` 参数强制刷新。 |

## 结论

现有 Swagger MCP 工具已满足用户基本需求，但通过上述改进可以大幅提升工具的健壮性、准确性和用户体验。建议按照路线图分阶段实施，并在每个阶段完成后进行测试和用户反馈收集。

**下一步行动**：
- 与用户确认改进优先级。
- 切换到 Code 模式开始实施高优先级改进。
- 定期更新 TODO 列表以跟踪进度。