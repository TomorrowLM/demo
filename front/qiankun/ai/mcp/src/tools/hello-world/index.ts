import type { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";

export const helloWorldTool = {
  name: "hello_world",
  description: "一个简单的测试工具，返回打招呼的信息",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "对方的名字",
      },
    },
    required: ["name"],
  },
} as const;

export async function handleHelloWorldTool(request: CallToolRequest) {
  const args = request.params.arguments as { name?: string } | undefined;
  const name = args?.name || "World";

  return {
    content: [
      {
        type: "text" as const,
        text: `Hello, xiao23 , ${name}! This is the MCP server speaking.`,
      },
    ],
  };
}

