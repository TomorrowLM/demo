import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { helloWorldTool, handleHelloWorldTool } from "./base/hello-world/index.js";
import { swaggerGetModelTool, handleSwaggerGetModelTool } from "./base/swagger/index.js";
import { createApiTool, handleCreateApiTool } from "./feature/createApi/index.js";

export const tools = [helloWorldTool, swaggerGetModelTool, createApiTool];

export async function dispatchTool(request: CallToolRequest) {
  switch (request.params.name) {
    case helloWorldTool.name:
      return handleHelloWorldTool(request);
    case swaggerGetModelTool.name:
      return handleSwaggerGetModelTool(request);
    case createApiTool.name:
      return handleCreateApiTool(request);
    default:
      return undefined;
  }
}

