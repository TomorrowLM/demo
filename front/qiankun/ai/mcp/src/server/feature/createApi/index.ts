import type { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { textResponseFromJson } from "@/utils/text.js";
import { handleSwaggerGetModelTool } from "@/server/base/swagger/index.js";
import { createApiToolInputSchema } from "./schema.js"
import { buildCreateApiInstruction } from "./instruction.js"

export const createApiTool = {
  name: "create_api_mcp",
  description: "通过 Swagger 获取接口信息，并通知模型在指定 API 文件中创建接口函数和 TypeScript 类型",
  inputSchema: createApiToolInputSchema,
} as const;

export async function handleCreateApiTool(request: CallToolRequest) {
  const args = request.params.arguments as {
    get_swagger_mcp: {
      source?: string;
      document?: unknown;
      name?: string;
      resolveRefs?: boolean;
      maxDepth?: number;
    };
    targetPath?: string;
  } | undefined;

  if (!args?.get_swagger_mcp) {
    throw new Error("create_api_mcp: 缺少必要的参数 'get_swagger_mcp'");
  }

  // 调用 Swagger 工具的处理函数获取接口信息
  const swaggerRequest: CallToolRequest = {
    ...request,
    params: {
      ...request.params,
      name: "get_swagger_mcp",
      arguments: args.get_swagger_mcp,
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

  // 构建结构化指令
  const instruction = buildCreateApiInstruction(args.targetPath);

  const responseData = {
    swaggerData: swaggerData,
    instruction,
    targetPath: args.targetPath,
    _note: "使用上述信息生成 API 代码，结构化指令提供了明确的任务和文件路径。",
  };

  return textResponseFromJson(responseData);
}
