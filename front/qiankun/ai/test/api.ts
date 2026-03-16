export interface CreateYlfaByAiRequest {
  modelName?: string; // 模型名称，默认：gpt-4.1
  templateUrl?: string;
  yldd?: string; // 演练地点
  ylfams?: string; // 演练方案描述
  ylmd?: string; // 演练目的
  ylsj?: string; // 演练时间，ISO 8601 字符串
}

export interface SseEmitter {
  timeout?: number;
}

/**
 * 调用 AI 生成演练方案（POST）
 * 注意：后端接口为 SSE（流式响应），此处以普通 POST+JSON 解析为例。
 */
export async function createYlfaByAiUsingPOST(
  data: CreateYlfaByAiRequest,
  baseUrl = ''
): Promise<SseEmitter> {
  const url = `${baseUrl}/dsb/yqarw/api/yqa/ai/sse/createYlfaByAi`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as SseEmitter;
}

export default createYlfaByAiUsingPOST;
import request from '@/utils/request';

// 错误原因
export interface ErrorReason {
  articles: string[];
  reason: string;
}

// 风险引用
export interface RiskReference {
  articleName: string;
  items: string[];
  refNum: string;
}

// 风险类别生成响应
export interface YqaRiskCategoryGenResp {
  conclusion: string;
  errorReason: ErrorReason;
  hitRisk: string[];
  isAiContent: string;
  riskCategory: number;
  riskMeasures: string;
  riskReferences: RiskReference[];
  userRiskCategory: number;
}

// API 函数：隐患确认AI识别隐患
export function aiDetectRiskConfirm(riskId: number) {
  return request.post<YqaRiskCategoryGenResp>(
    `/dsb/yqarw/api/yqa/common/ai/detect/risk/level/${riskId}`
  );
}
