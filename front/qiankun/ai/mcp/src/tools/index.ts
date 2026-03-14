import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { helloWorldTool, handleHelloWorldTool } from "./hello-world/index.js";
import { swaggerGetModelTool, handleSwaggerGetModelTool } from "./swagger/index.js";

export const tools = [helloWorldTool, swaggerGetModelTool];

export async function dispatchTool(request: CallToolRequest) {
  switch (request.params.name) {
    case helloWorldTool.name:
      return handleHelloWorldTool(request);
    case swaggerGetModelTool.name:
      return handleSwaggerGetModelTool(request);
    default:
      return undefined;
  }
}

