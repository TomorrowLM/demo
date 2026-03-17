/**
 * 基础响应类型
 */
export interface Result<T = any> {
  code: number;
  datas: T;
  error?: string;
  msg?: string;
  path?: string;
  traceId?: string;
}

/**
 * 错误原因类型
 */
export interface ErrorReason {
  articles: string[];
  reason: string;
}

/**
 * 风险参考依据类型
 */
export interface RiskReference {
  articleName: string;
  items: string[];
  refNum: string;
}

/**
 * YQA风险类别生成响应类型
 */
export interface YqaRiskCategoryGenResp {
  conclusion: string;
  errorReason?: ErrorReason;
  hitRisk: string[];
  isAiContent: string;
  riskCategory: number;
  riskMeasures: string;
  riskReferences?: RiskReference[];
  userRiskCategory: number;
}

/**
 * 隐患确认AI识别隐患-隐患确认时调用
 * 
 * @param riskId 风险ID
 * @returns 返回风险类别识别结果
 */
export async function aiDetectRiskConfirm(
  riskId: number
): Promise<Result<YqaRiskCategoryGenResp>> {
  const response = await fetch(
    `/dsb/yqarw/api/yqa/common/ai/detect/risk/level/${riskId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * 使用示例
 */
export async function exampleUsage() {
  try {
    const result = await aiDetectRiskConfirm(12345);
    
    if (result.code === 200) {
      console.log('AI识别结果:', result.datas);
      console.log('隐患类别:', result.datas.riskCategory);
      console.log('判断结论:', result.datas.conclusion);
      console.log('整改建议:', result.datas.riskMeasures);
      
      if (result.datas.riskReferences) {
        console.log('法规依据:', result.datas.riskReferences);
      }
    } else {
      console.error('请求失败:', result.msg);
    }
  } catch (error) {
    console.error('调用API时发生错误:', error);
  }
}