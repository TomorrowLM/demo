import type { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { textResponseFromJson } from "../../utils/text.js";
import type { SwaggerGetModelArgs } from "./types.js";
import {
  loadDocument,
  getSchemasRoot,
  resolveSchemaNode,
  findOperationByKeyword,
  extractOperationIO,
} from "./utils/index.js";

const swaggerGetModelInputSchema = {
  type: "object",
  properties: {
    source: {
      type: "string",
      description: "Swagger/OpenAPI 文档 URL 或本地文件路径（JSON）",
      default: "https://apit-dsb.dingtax.cn/dsb/yqarw/api/doc.html#/",
    },
    document: {
      type: "object",
      description: "直接传入 Swagger/OpenAPI 文档对象（优先于 source）",
    },
    name: {
      type: "string",
      // description: "模型名（不传则返回所有模型名）",
      description: "隐患确认AI识别隐患-非隐患确认时调用",
    },
    resolveRefs: {
      type: "boolean",
      description: "是否解析 $ref（默认 true）",
    },
    maxDepth: {
      type: "number",
      description: "解析深度（默认 6）",
    },
  },
} as const;

export const swaggerGetModelTool = {
  name: "swagger_get_model",
  description: "读取 Swagger/OpenAPI 文档，列出模型或返回指定模型的数据结构（支持解析 $ref）",
  inputSchema: swaggerGetModelInputSchema,
} as const;

// 处理 Swagger/OpenAPI 模型获取工具调用
export async function handleSwaggerGetModelTool(request: CallToolRequest) {
  const args = (request.params.arguments ?? {}) as SwaggerGetModelArgs;
  
  console.error(`DEBUG handleSwaggerGetModelTool: request.params.arguments = ${JSON.stringify(request.params.arguments)}`);
  console.error(`DEBUG handleSwaggerGetModelTool: args.source = ${JSON.stringify(args.source)}`);
  
  // 确保 args 有默认的 source 值
  // 如果 source 为空或未定义，设置为默认值
  if (args.source === undefined || args.source === null || args.source.trim() === "") {
    console.error(`DEBUG handleSwaggerGetModelTool: setting default source`);
    args.source = "https://apit-dsb.dingtax.cn/dsb/yqarw/api/doc.html#/";
  }
  
  console.error(`DEBUG handleSwaggerGetModelTool: final args.source = ${JSON.stringify(args.source)}`);
  
  const doc = await loadDocument(args);
  const schemas = getSchemasRoot(doc as any);
  const names = Object.keys(schemas).sort((a, b) => a.localeCompare(b));

  const resolveRefs = args.resolveRefs ?? true;
  const maxDepth = Number.isFinite(args.maxDepth) ? Math.max(0, Math.floor(args.maxDepth!)) : 6;

  if (!args.name) {
    return textResponseFromJson({ models: names });
  }

  const rawModel = (schemas as any)[args.name];
  if (!rawModel) {
    const found = findOperationByKeyword(doc as any, args.name);
    if (found) {
      const io = extractOperationIO(doc as any, found);
      const operationResult = {
        match: "operation",
        keyword: args.name,
        operation: io.operation,
        request: {
          ...io.request,
          body: resolveRefs && io.request.body
            ? resolveSchemaNode({ doc, node: io.request.body, depth: maxDepth, seenRefs: new Set() })
            : io.request.body,
        },
        response: {
          ...io.response,
          body: resolveRefs && io.response.body
            ? resolveSchemaNode({ doc, node: io.response.body, depth: maxDepth, seenRefs: new Set() })
            : io.response.body,
        },
      };

      return textResponseFromJson(operationResult);
    }

    return textResponseFromJson({ error: `未找到模型: ${args.name}`, models: names });
  }

  const model = resolveRefs
    ? resolveSchemaNode({ doc, node: rawModel, depth: maxDepth, seenRefs: new Set() })
    : rawModel;

  return textResponseFromJson({ name: args.name, schema: model });
}
