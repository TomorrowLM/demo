import { swaggerGetModelInputSchema } from "@/server/base/swagger/schema.js";

export const createApiToolInputSchema = {
  type: "object",
  properties: {
    get_swagger_mcp: {
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
  required: ["get_swagger_mcp"],
} as const;