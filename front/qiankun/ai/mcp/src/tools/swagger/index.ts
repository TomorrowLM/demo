import type { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";

type SwaggerGetModelArgs = {
  source?: string;
  document?: unknown;
  name?: string;
  resolveRefs?: boolean;
  maxDepth?: number;
};

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

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function normalizeSource(value: string) {
  let result = value.trim();

  const unwrapOnce = (left: string, right: string) => {
    if (result.startsWith(left) && result.endsWith(right) && result.length >= left.length + right.length) {
      result = result.slice(left.length, result.length - right.length).trim();
      return true;
    }
    return false;
  };

  for (let i = 0; i < 3; i += 1) {
    if (
      unwrapOnce('"', '"') ||
      unwrapOnce("'", "'") ||
      unwrapOnce("`", "`")
    ) {
      continue;
    }
    break;
  }

  const urlMatch = result.match(/https?:\/\/[^\s"'`]+/i);
  if (urlMatch?.[0]) return urlMatch[0];

  return result.replace(/[`'"\s]+/g, "").trim();
}

function chunkText(text: string, chunkSize: number) {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

function textResponseFromText(text: string) {
  const chunkSize = 12000;
  const parts = chunkText(text, chunkSize);
  if (parts.length <= 1) {
    return {
      content: [{ type: "text" as const, text }],
    };
  }
  return {
    content: parts.map((part, index) => ({
      type: "text" as const,
      text: `[part ${index + 1}/${parts.length}]\n${part}`,
    })),
  };
}

function textResponseFromJson(payload: unknown) {
  const text = JSON.stringify(payload, null, 2);
  return textResponseFromText(text);
}

// 加载 Swagger/OpenAPI 文档（支持 HTTP URL 和本地文件路径）
async function loadDocument(args: SwaggerGetModelArgs) {
  if (args.document && typeof args.document === "object") return args.document;
  
  // 使用默认 URL 如果 source 未提供或为空
  const defaultSource = "https://apit-dsb.dingtax.cn/dsb/yqarw/api/doc.html#/";
  let source: string | undefined;
  
  console.error(`DEBUG: args.source = ${JSON.stringify(args.source)}`);
  console.error(`DEBUG: args.source !== undefined = ${args.source !== undefined}`);
  console.error(`DEBUG: args.source !== null = ${args.source !== null}`);
  console.error(`DEBUG: args.source?.trim() !== "" = ${args.source?.trim() !== ""}`);
  
  if (args.source !== undefined && args.source !== null && args.source.trim() !== "") {
    source = normalizeSource(args.source);
    console.error(`DEBUG: normalized source = ${source}`);
  } else {
    source = defaultSource;
    console.error(`DEBUG: using default source = ${source}`);
  }
  
  console.error(`DEBUG: final source = ${source}`);
  
  if (!source || source.trim() === "") {
    throw new Error("swagger_get_model: 需要提供 source 或 document");
  }

  if (isHttpUrl(source)) {
    const tryFetchJson = async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`swagger_get_model: 拉取失败 ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      const json = JSON.parse(text) as unknown;
      return json;
    };

    const isValidSpec = (doc: any) => {
      if (!doc || typeof doc !== "object") return false;
      if (typeof doc.openapi === "string") return true;
      if (doc.swagger === "2.0") return true;
      if (doc.components?.schemas && typeof doc.components.schemas === "object") return true;
      if (doc.definitions && typeof doc.definitions === "object") return true;
      return false;
    };

    try {
      const doc = await tryFetchJson(source);
      if (isValidSpec(doc)) return doc;
    } catch (error) {
      void error;
    }

    const candidateUrls: string[] = [];
    try {
      const inputUrl = new URL(source);
      inputUrl.hash = "";
      const pathname = inputUrl.pathname.replace(/\/+$/, "");
      const isDocHtml = /\/doc\.html$/i.test(pathname) || /\/swagger-ui\.html$/i.test(pathname);
      if (isDocHtml) {
        const basePath = pathname.replace(/\/(doc\.html|swagger-ui\.html)$/i, "/");
        const baseUrl = new URL(inputUrl.toString());
        baseUrl.pathname = basePath;
        baseUrl.search = "";

        candidateUrls.push(new URL("v3/api-docs", baseUrl).toString());
        candidateUrls.push(new URL("v2/api-docs", baseUrl).toString());
        candidateUrls.push(new URL("swagger-resources", baseUrl).toString());
      }
    } catch (error) {
      void error;
    }

    for (const url of candidateUrls) {
      try {
        const doc = await tryFetchJson(url);
        if (isValidSpec(doc)) return doc;

        if (Array.isArray(doc)) {
          const firstWithUrl = doc.find((item: any) => item && typeof item.url === "string") as
            | { url: string }
            | undefined;
          if (firstWithUrl?.url) {
            const base = new URL(url);
            const nextUrl = new URL(firstWithUrl.url.replace(/^\//, ""), base).toString();
            const nextDoc = await tryFetchJson(nextUrl);
            if (isValidSpec(nextDoc)) return nextDoc;
          }
        }
      } catch (error) {
        void error;
      }
    }

    throw new Error(
      `swagger_get_model: 无法从该 URL 获取可解析的 Swagger/OpenAPI JSON。请传入 JSON 文档地址（如 /v2/api-docs 或 /v3/api-docs），当前: ${source}`
    );
  }

  const filePath = path.isAbsolute(source) ? source : path.resolve(process.cwd(), source);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as unknown;
}

// 从 Swagger/OpenAPI 文档中提取模型定义（支持解析 $ref）
function getSchemasRoot(doc: any): Record<string, any> {
  if (doc?.openapi && doc?.components?.schemas && typeof doc.components.schemas === "object") {
    return doc.components.schemas;
  }
  if (doc?.swagger === "2.0" && doc?.definitions && typeof doc.definitions === "object") {
    return doc.definitions;
  }
  if (doc?.components?.schemas && typeof doc.components.schemas === "object") {
    return doc.components.schemas;
  }
  if (doc?.definitions && typeof doc.definitions === "object") {
    return doc.definitions;
  }
  return {};
}

function decodeJsonPointerToken(token: string) {
  return token.replace(/~1/g, "/").replace(/~0/g, "~");
}

function getByJsonPointer(root: any, pointer: string) {
  const trimmed = pointer.replace(/^#/, "");
  if (!trimmed) return root;
  const segments = trimmed.split("/").filter(Boolean).map(decodeJsonPointerToken);
  let current = root;
  for (const key of segments) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[key];
  }
  return current;
}

// 递归解析 Swagger/OpenAPI 文档中的 $ref（支持循环引用）
function resolveSchemaNode(options: {
  doc: any;
  node: any;
  depth: number;
  seenRefs: Set<string>;
}): any {
  const { doc, node, depth, seenRefs } = options;
  if (depth <= 0) return node;
  if (!node || typeof node !== "object") return node;

  if (typeof node.$ref === "string") {
    const ref = node.$ref as string;
    if (!ref.startsWith("#/")) return { $ref: ref };
    if (seenRefs.has(ref)) return { $ref: ref };
    const target = getByJsonPointer(doc, ref);
    if (target == null) return { $ref: ref };
    const nextSeen = new Set(seenRefs);
    nextSeen.add(ref);
    return resolveSchemaNode({ doc, node: target, depth: depth - 1, seenRefs: nextSeen });
  }

  if (Array.isArray(node.allOf)) {
    const parts = node.allOf.map((part: any) =>
      resolveSchemaNode({ doc, node: part, depth: depth - 1, seenRefs })
    );
    return { ...node, allOf: parts };
  }

  if (Array.isArray(node.oneOf)) {
    const parts = node.oneOf.map((part: any) =>
      resolveSchemaNode({ doc, node: part, depth: depth - 1, seenRefs })
    );
    return { ...node, oneOf: parts };
  }

  if (Array.isArray(node.anyOf)) {
    const parts = node.anyOf.map((part: any) =>
      resolveSchemaNode({ doc, node: part, depth: depth - 1, seenRefs })
    );
    return { ...node, anyOf: parts };
  }

  const resolved: any = Array.isArray(node) ? [] : { ...node };

  if (resolved.properties && typeof resolved.properties === "object") {
    const nextProps: Record<string, any> = {};
    for (const [key, value] of Object.entries(resolved.properties)) {
      nextProps[key] = resolveSchemaNode({ doc, node: value, depth: depth - 1, seenRefs });
    }
    resolved.properties = nextProps;
  }

  if (resolved.items) {
    resolved.items = resolveSchemaNode({ doc, node: resolved.items, depth: depth - 1, seenRefs });
  }

  if (resolved.additionalProperties && typeof resolved.additionalProperties === "object") {
    resolved.additionalProperties = resolveSchemaNode({
      doc,
      node: resolved.additionalProperties,
      depth: depth - 1,
      seenRefs,
    });
  }

  return resolved;
}

function findOperationByKeyword(doc: any, keyword: string) {
  const paths = doc?.paths;
  if (!paths || typeof paths !== "object") return undefined;

  const normalizedKeyword = keyword.trim();
  if (!normalizedKeyword) return undefined;

  const httpMethods = new Set([
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "options",
    "head",
    "trace",
  ]);

  const scoreOf = (op: any, method: string, pathKey: string) => {
    const textParts = [
      op?.summary,
      op?.description,
      op?.operationId,
      Array.isArray(op?.tags) ? op.tags.join(" ") : undefined,
      method,
      pathKey,
    ]
      .filter(Boolean)
      .map((v: any) => String(v));

    const haystack = textParts.join(" ").toLowerCase();
    const needle = normalizedKeyword.toLowerCase();
    if (!haystack.includes(needle)) return -1;

    let score = 1;
    if (String(op?.summary ?? "").includes(normalizedKeyword)) score += 3;
    if (String(op?.operationId ?? "").includes(normalizedKeyword)) score += 2;
    if (String(pathKey).includes(normalizedKeyword)) score += 1;
    return score;
  };

  let best:
    | {
        path: string;
        method: string;
        operation: any;
        score: number;
      }
    | undefined;

  for (const [pathKey, item] of Object.entries(paths)) {
    if (!item || typeof item !== "object") continue;
    for (const [method, operation] of Object.entries(item as any)) {
      const m = String(method).toLowerCase();
      if (!httpMethods.has(m)) continue;
      const score = scoreOf(operation, m, pathKey);
      if (score < 0) continue;
      if (!best || score > best.score) {
        best = { path: pathKey, method: m, operation, score };
      }
    }
  }

  return best;
}

function pickFirstContentSchema(content: any) {
  if (!content || typeof content !== "object") return undefined;
  const preferred = ["application/json", "application/*+json", "*/*"];
  for (const key of preferred) {
    const entry = content[key];
    if (entry?.schema) return entry.schema;
  }
  const firstKey = Object.keys(content)[0];
  const first = firstKey ? content[firstKey] : undefined;
  return first?.schema;
}

function extractOperationIO(doc: any, found: { path: string; method: string; operation: any }) {
  const op = found.operation;
  const isOAS3 = typeof doc?.openapi === "string";

  if (isOAS3) {
    const requestBodySchema = pickFirstContentSchema(op?.requestBody?.content);
    const parameters = Array.isArray(op?.parameters)
      ? op.parameters.map((p: any) => ({
          name: p?.name,
          in: p?.in,
          required: p?.required,
          schema: p?.schema,
          description: p?.description,
        }))
      : [];

    const responses = op?.responses && typeof op.responses === "object" ? op.responses : {};
    const preferredCodes = ["200", "201", "default"];
    const code =
      preferredCodes.find((c) => responses[c]) ?? Object.keys(responses).sort()[0] ?? "200";
    const responseSchema = pickFirstContentSchema(responses?.[code]?.content);

    return {
      operation: {
        path: found.path,
        method: found.method,
        summary: op?.summary,
        operationId: op?.operationId,
        tags: op?.tags,
      },
      request: { body: requestBodySchema, parameters },
      response: { code, body: responseSchema },
    };
  }

  const parameters = Array.isArray(op?.parameters) ? op.parameters : [];
  const bodyParam = parameters.find((p: any) => p && p.in === "body" && p.schema);
  const nonBodyParams = parameters
    .filter((p: any) => p && p.in !== "body")
    .map((p: any) => ({
      name: p?.name,
      in: p?.in,
      required: p?.required,
      type: p?.type,
      schema: p?.schema,
      description: p?.description,
    }));

  const responses = op?.responses && typeof op.responses === "object" ? op.responses : {};
  const preferredCodes = ["200", "201", "default"];
  const code = preferredCodes.find((c) => responses[c]) ?? Object.keys(responses).sort()[0] ?? "200";
  const responseSchema = responses?.[code]?.schema;

  return {
    operation: {
      path: found.path,
      method: found.method,
      summary: op?.summary,
      operationId: op?.operationId,
      tags: op?.tags,
    },
    request: { body: bodyParam?.schema, parameters: nonBodyParams },
    response: { code, body: responseSchema },
  };
}

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
