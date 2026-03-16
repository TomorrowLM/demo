import type { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { textResponseFromJson } from "../../../utils/text.js";
import { handleSwaggerGetModelTool } from "../../base/swagger/index.js";

// Swagger 工具的输入模式（从 swagger/index.ts 复制）
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
      description: "模型名（不传则返回所有模型名）",
      default: "",
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

export const createApiTool = {
  name: "create_api",
  description: "通过 Swagger 获取接口信息，并通知模型在指定 API 文件中创建接口函数和 TypeScript 类型",
  inputSchema: {
    type: "object",
    properties: {
      swagger_get_model: {
        type: "object",
        description: "Swagger 工具参数",
        properties: swaggerGetModelInputSchema.properties,
        required: [],
      },
      targetPath: {
        type: "string",
        description: "目标 API 文件路径（可选），用于提示模型生成代码的位置",
      },
    },
    required: ["swagger_get_model"],
  },
} as const;

export async function handleCreateApiTool(request: CallToolRequest) {
  const args = request.params.arguments as {
    swagger_get_model: {
      source?: string;
      document?: unknown;
      name?: string;
      resolveRefs?: boolean;
      maxDepth?: number;
    };
    targetPath?: string;
  } | undefined;

  if (!args?.swagger_get_model) {
    throw new Error("create_api: 缺少必要的参数 'swagger_get_model'");
  }

  // 调用 Swagger 工具的处理函数获取接口信息
  const swaggerRequest: CallToolRequest = {
    ...request,
    params: {
      ...request.params,
      name: "swagger_get_model",
      arguments: args.swagger_get_model,
    },
  };

  const swaggerResult = await handleSwaggerGetModelTool(swaggerRequest);
  
  // 提取 Swagger 工具返回的数据
  let swaggerData: any;
  if (swaggerResult.content && swaggerResult.content[0]?.type === "text") {
    try {
      swaggerData = JSON.parse(swaggerResult.content[0].text);
    } catch (err) {
      swaggerData = { error: "解析 Swagger 响应失败" };
    }
  } else {
    swaggerData = { error: "Swagger 工具返回格式异常" };
  }

  // 构建指令消息
  const instruction = args.targetPath
    ? `请在文件 ${args.targetPath} 中创建对应的 TypeScript 函数和类型定义。`
    : "请根据接口信息创建 TypeScript 函数和类型定义。";

  const responseData = {
    ...swaggerData,
    instruction,
    targetPath: args.targetPath,
    _note: "使用上述信息生成 API 代码，并写入指定文件（如果提供了 targetPath）。",
  };

  return textResponseFromJson(responseData);
}
