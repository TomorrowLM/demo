/**
 * Swagger/OpenAPI 文档处理工具
 */

import fs from "node:fs/promises";
import path from "node:path";
import { isHttpUrl, normalizeSource } from "../../../utils/url.js";
import type { SwaggerGetModelArgs } from "../types.js";

/**
 * 验证文档是否为有效的 Swagger/OpenAPI 规范
 */
function isValidSpec(doc: any): boolean {
  if (!doc || typeof doc !== "object") return false;
  if (typeof doc.openapi === "string") return true;
  if (doc.swagger === "2.0") return true;
  if (doc.components?.schemas && typeof doc.components.schemas === "object") return true;
  if (doc.definitions && typeof doc.definitions === "object") return true;
  return false;
}

/**
 * 尝试从 URL 获取 JSON 文档
 */
async function tryFetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`swagger_get_model: 拉取失败 ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  const json = JSON.parse(text) as unknown;
  return json;
}

/**
 * 加载 Swagger/OpenAPI 文档（支持 HTTP URL 和本地文件路径）
 */
export async function loadDocument(args: SwaggerGetModelArgs): Promise<any> {
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

/**
 * 从 Swagger/OpenAPI 文档中提取模型定义根节点
 */
export function getSchemasRoot(doc: any): Record<string, any> {
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