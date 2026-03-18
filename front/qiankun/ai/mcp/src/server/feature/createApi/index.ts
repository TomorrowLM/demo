import type { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { textResponseFromJson } from "@/utils/text.js";
import { handleSwaggerGetModelTool } from "@/server/base/swagger/index.js";
import { createApiToolInputSchema } from "./schema.js";
import { buildCreateApiInstruction } from "./instruction.js";

type CreateApiToolItemArgs = {
  source?: string;
  document?: unknown;
  name?: string;
  resolveRefs?: boolean;
  maxDepth?: number;
  targetPath?: string;
};

type CreateApiToolArgs = {
  requests?: CreateApiToolItemArgs[];
};

function parseSwaggerResponse(swaggerResult: Awaited<ReturnType<typeof handleSwaggerGetModelTool>>) {
  if (swaggerResult.content && swaggerResult.content[0]?.type === "text") {
    try {
      return JSON.parse(swaggerResult.content[0].text);
    } catch (err) {
      void err;
      return { error: "解析 Swagger 响应失败" };
    }
  }
  return { error: "Swagger 工具返回格式异常" };
}

export const createApiTool = {
  name: "create_api_mcp",
  description: "通过 Swagger 获取接口信息，并通知模型在指定 API 文件中创建接口函数和 TypeScript 类型",
  inputSchema: createApiToolInputSchema,
} as const;

export async function handleCreateApiTool(request: CallToolRequest) {
  const rawArgs = request.params.arguments as CreateApiToolArgs | undefined;
  console.error("Received create_api_mcp request with arguments:", rawArgs);
  const argsList = Array.isArray(rawArgs?.requests) ? rawArgs.requests : [];

  if (!Array.isArray(rawArgs?.requests)) {
    throw new Error("create_api_mcp: 参数 'requests' 必须是数组");
  }

  if (argsList.length === 0) {
    throw new Error("create_api_mcp: 缺少必要的参数 'requests'");
  }

  const invalidIndex = argsList.findIndex((item) => !item);
  if (invalidIndex !== -1) {
    throw new Error(`create_api_mcp: 第 ${invalidIndex + 1} 项参数无效`);
  }

  const responseList = await Promise.all(
    argsList.map(async (args) => {
      const { targetPath, ...swaggerArgs } = args;
      const swaggerRequest: CallToolRequest = {
        ...request,
        params: {
          ...request.params,
          name: "get_swagger_mcp",
          arguments: swaggerArgs,
        },
      };

      const swaggerResult = await handleSwaggerGetModelTool(swaggerRequest);
      const swaggerData = parseSwaggerResponse(swaggerResult);
      const instruction = buildCreateApiInstruction(targetPath);

      return {
        swaggerData,
        instruction,
        targetPath,
        _note: "使用上述信息生成 API 代码，结构化指令提供了明确的任务和文件路径。",
      };
    })
  );

  return textResponseFromJson(responseList);
}
