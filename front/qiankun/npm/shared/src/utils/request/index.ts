/**
 * Axios HTTP 请求工具封装
 * 基于 Axios 封装的 HTTP 请求工具，提供统一的请求管理、错误处理、加载状态控制等功能。
 *
 * 主要特性：
 * 1. 统一的请求/响应拦截器
 * 2. 自动重复请求管理（GET请求）
 * 3. 全局加载状态控制
 * 4. 智能错误处理和提示
 * 5. 自动 Content-Type 设置
 * 6. 请求取消和状态管理
 */

import type { ApiResponse } from './types';
// message/loading providers will be injected by the consumer.
// Provide default no-op implementations to avoid runtime errors if not set.
// 支持两种形式的提供者：
// 1. 类构造器（Consumer 传入 MessageClass/LoadingClass），shared 内部会进行实例化并调用实例方法；
// 2. 直接的对象实现（含 error/success/loading/destroy 或 start/stop 等方法）。

type MessageProviderInstance = {
  add?: (opts: any) => any;
  remove?: (opts: any) => any;
  clear?: () => void;
  error?: (text: string) => void;
  success?: (text: string) => void;
  loading?: (opts: any) => any;
  destroy?: (key?: string) => void;
};

type LoadingProviderInstance = {
  add?: () => any;
  remove?: (target?: any) => void;
  clear?: () => void;
  start?: () => any;
  stop?: (instance?: any) => void;
};

let messageProviderInstance: MessageProviderInstance | null = null;
let loadingProviderInstance: LoadingProviderInstance | null = null;

export function setMessageProvider(provider: any) {
  // provider can be a class (constructor) or object
  try {
    if (typeof provider === 'function') {
      // constructor
      messageProviderInstance = new provider();
    } else {
      messageProviderInstance = provider;
    }
  } catch (err) {
    messageProviderInstance = provider;
  }
}

export function setLoadingProvider(provider: any) {
  try {
    if (typeof provider === 'function') {
      loadingProviderInstance = new provider();
    } else {
      loadingProviderInstance = provider;
    }
  } catch (err) {
    loadingProviderInstance = provider;
  }
}
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// ==================== 常量定义 ====================
const IS_DEV = process.env.NODE_ENV === 'development';
const GLOBAL_LOADING_KEY = 'global-loading';
const DEFAULT_TIMEOUT = 60000;

// HTTP 状态码对应的错误消息
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  0: '网络连接失败，请检查网络设置',
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求资源不存在',
  405: '请求方法不允许',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
};

// 成功的业务状态码集合
const SUCCESS_CODES = new Set<number | string>([0, 1, '0', '1']);

// ==================== 类型定义 ====================
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示全局加载提示 */
  showLoading?: boolean;
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 是否忽略重复请求检查 */
  ignoreDuplicate?: boolean;
  /** 自定义错误处理器 */
  customErrorHandler?: (error: AxiosError) => void;
}

interface RequestState {
  loadingCount: number;
  pendingRequests: Map<string, AbortController>;
}

// ==================== 状态管理 ====================
const requestState: RequestState = {
  loadingCount: 0,
  pendingRequests: new Map<string, AbortController>(),
};

// ==================== 工具函数 ====================

/**
 * 生成请求的唯一标识键
 */
const generateRequestKey = (config: RequestConfig): string => {
  const method = (config.method || 'GET').toUpperCase();
  const url = config.url || '';
  return `${method}|${url}`;
};

/**
 * 判断是否为请求取消错误
 */
const isCancelError = (error: unknown): boolean => {
  return (
    axios.isCancel(error) ||
    (error instanceof AxiosError && error.code === 'ERR_CANCELED') ||
    (error as any)?.name === 'AbortError'
  );
};

/**
 * 解析错误消息
 */
const resolveErrorMessage = (status?: number, data?: ApiResponse): string => {
  // 优先使用业务错误消息
  if (data?.msg || data?.error) {
    return (data.msg || data.error)!;
  }

  // 使用HTTP状态码对应的消息
  if (status && HTTP_STATUS_MESSAGES[status]) {
    return HTTP_STATUS_MESSAGES[status];
  }

  // 默认错误消息
  return status ? `请求失败 (${status})` : '网络连接失败，请检查网络设置';
};

/**
 * 清理GET请求的空参数
 */
const cleanEmptyParams = (params: any): any => {
  if (!params || typeof params !== 'object') {
    return params;
  }

  const cleanedParams: Record<string, unknown> = {};
  let hasChanges = false;

  Object.keys(params).forEach((key) => {
    const value = params[key];

    // 过滤空字符串和null/undefined值
    if (value === '' || value === null || value === undefined) {
      hasChanges = true;
      return;
    }

    cleanedParams[key] = value;
  });

  return hasChanges ? cleanedParams : params;
};

/**
 * 根据数据类型自动设置Content-Type
 */
const setContentTypeHeader = (config: RequestConfig): void => {
  const headers = (config.headers ||= {});

  // 如果已经设置了Content-Type，则不覆盖
  if (headers['Content-Type'] || !config.data) {
    return;
  }

  // FormData类型不设置Content-Type，浏览器会自动处理
  if (config.data instanceof FormData) {
    return;
  }

  // 字符串类型数据
  if (typeof config.data === 'string') {
    const trimmedData = config.data.trim();

    // 尝试判断是否为JSON字符串
    if (trimmedData.startsWith('{') || trimmedData.startsWith('[')) {
      try {
        JSON.parse(trimmedData);
        headers['Content-Type'] = 'application/json';
        return;
      } catch {
        // 如果不是有效的JSON，则作为普通文本处理
      }
    }

    headers['Content-Type'] = 'text/plain';
    return;
  }

  // 对象类型数据默认使用JSON
  if (typeof config.data === 'object') {
    headers['Content-Type'] = 'application/json';
  }
};

// ==================== Loading 管理 ====================

/**
 * 开始全局加载
 */
const startGlobalLoading = (): void => {
  if (requestState.loadingCount === 0) {
    // Prefer loadingProviderInstance.start/add, otherwise fallback to messageProviderInstance.loading/add
    try {
      if (loadingProviderInstance && typeof loadingProviderInstance.start === 'function') {
        loadingProviderInstance.start();
      } else if (loadingProviderInstance && typeof loadingProviderInstance.add === 'function') {
        loadingProviderInstance.add();
      } else if (messageProviderInstance && typeof messageProviderInstance.loading === 'function') {
        messageProviderInstance.loading({ content: '加载中...', key: GLOBAL_LOADING_KEY, duration: 0 });
      }
    } catch {
      // ignore
    }
  }
  requestState.loadingCount++;
};

/**
 * 停止全局加载
 */
const stopGlobalLoading = (): void => {
  if (requestState.loadingCount > 0) {
    requestState.loadingCount--;

    if (requestState.loadingCount === 0) {
      try {
        if (loadingProviderInstance && typeof loadingProviderInstance.stop === 'function') {
          loadingProviderInstance.stop();
        } else if (loadingProviderInstance && typeof loadingProviderInstance.remove === 'function') {
          loadingProviderInstance.remove();
        } else if (messageProviderInstance && typeof messageProviderInstance.destroy === 'function') {
          messageProviderInstance.destroy(GLOBAL_LOADING_KEY);
        }
      } catch {
        // ignore
      }
    }
  }
};

// ==================== 重复请求管理 ====================

/**
 * 添加GET请求到待处理队列（防止重复请求）
 */
const addToPendingQueue = (config: RequestConfig): void => {
  const method = config.method?.toLowerCase();

  // 只对GET请求进行重复检查，除非明确忽略
  if (method !== 'get' || config.ignoreDuplicate) {
    return;
  }

  const requestKey = generateRequestKey(config);
  const existingController = requestState.pendingRequests.get(requestKey);

  // 如果存在相同的未完成请求，则取消它
  if (existingController && !existingController.signal.aborted) {
    existingController.abort();
    requestState.pendingRequests.delete(requestKey);

    if (IS_DEV) {
      console.warn('[请求工具] 取消重复请求:', requestKey);
    }
  }

  // 创建新的AbortController并添加到队列
  const controller = new AbortController();
  config.signal = controller.signal;
  requestState.pendingRequests.set(requestKey, controller);
};

/**
 * 从待处理队列中移除请求
 */
const removeFromPendingQueue = (config?: RequestConfig): void => {
  if (!config || config.method?.toLowerCase() !== 'get') {
    return;
  }

  const requestKey = generateRequestKey(config);
  requestState.pendingRequests.delete(requestKey);
};

// ==================== 错误处理 ====================

/**
 * 处理未授权错误（401）
 */
const handleUnauthorizedError = (): void => {
  // 延迟执行，避免在错误处理过程中出现异常
  setTimeout(() => {
    try {
      // 清理本地存储
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      // 忽略清理存储时的错误
    }

    // 重定向到登录页
    const currentUrl = encodeURIComponent(window.location.href || '/');
    window.location.href = `/login?redirect=${currentUrl}`;
  }, 300);
};

/**
 * 处理请求错误
 */
const handleRequestError = (
  error: AxiosError,
  config: RequestConfig = {},
): void => {
  // 如果是取消错误，直接返回
  if (isCancelError(error)) {
    return;
  }

  // 优先使用自定义错误处理器
  if (config.customErrorHandler) {
    try {
      config.customErrorHandler(error);
      return;
    } catch (handlerError) {
      if (IS_DEV) {
        console.error('[请求工具] 自定义错误处理器异常:', handlerError);
      }
    }
  }

  // 获取错误信息
  const status = error.response?.status;
  const data = error.response?.data as ApiResponse | undefined;
  const errorMessage = resolveErrorMessage(status, data);

  // 显示错误提示（除非明确配置不显示）
    if (config.showError !== false) {
      try {
        if (messageProviderInstance) {
          if (typeof messageProviderInstance.error === 'function') {
            messageProviderInstance.error(errorMessage);
          } else if (typeof messageProviderInstance.add === 'function') {
            messageProviderInstance.add({ text: errorMessage, type: 'error', key: GLOBAL_LOADING_KEY });
          }
        }
      } catch {
        // 忽略消息显示错误
      }
    }

  // 处理未授权错误
  if (status === 401) {
    handleUnauthorizedError();
  }

  // 开发环境记录详细错误信息
  if (IS_DEV) {
    console.error('[请求工具] 请求错误:', {
      url: error.config?.url,
      method: error.config?.method,
      status,
      message: errorMessage,
      error,
    });
  }
};

// ==================== 请求拦截器 ====================

/**
 * 请求拦截器
 */
const requestInterceptor = (
  config: InternalAxiosRequestConfig & RequestConfig,
): InternalAxiosRequestConfig => {
  const requestConfig = config as RequestConfig;

  // 清理GET请求参数
  if (requestConfig.method?.toLowerCase() === 'get' && requestConfig.params) {
    requestConfig.params = cleanEmptyParams(requestConfig.params);
  }

  // 自动设置Content-Type
  setContentTypeHeader(requestConfig);

  // GET请求添加时间戳防止缓存
  if (requestConfig.method?.toLowerCase() === 'get') {
    requestConfig.params = {
      ...(requestConfig.params || {}),
      _t: Date.now(),
    };
  }

  // 添加到重复请求检查队列
  addToPendingQueue(requestConfig);

  // 显示加载提示
  if (requestConfig.showLoading) {
    startGlobalLoading();
  }

  return config;
};

/**
 * 请求错误拦截器
 */
const requestErrorInterceptor = (error: AxiosError): Promise<never> => {
  const config = error.config as RequestConfig | undefined;

  // 停止加载提示
  if (config?.showLoading) {
    stopGlobalLoading();
  }

  // 如果是取消错误，返回一个永远不会resolve的Promise
  if (isCancelError(error)) {
    return new Promise(() => {});
  }

  return Promise.reject(error);
};

// ==================== 响应拦截器 ====================

/**
 * 响应拦截器
 */
const responseInterceptor = (
  response: AxiosResponse<ApiResponse>,
): AxiosResponse<ApiResponse> | Promise<never> => {
  const config = response.config as RequestConfig;

  // 从待处理队列中移除
  removeFromPendingQueue(config);

  // 检查业务状态码
  if (
    !SUCCESS_CODES.has(response.data.code as any) &&
    response.data.code !== undefined
  ) {
    const errorMessage = response.data.msg || '业务处理失败';

    // 停止加载提示
    if (config.showLoading) {
      stopGlobalLoading();
    }

    // 显示错误提示
    if (config.showError !== false) {
      if (messageProviderInstance) {
        if (typeof messageProviderInstance.error === 'function') {
          messageProviderInstance.error(errorMessage);
        } else if (typeof messageProviderInstance.add === 'function') {
          messageProviderInstance.add({ text: errorMessage, type: 'error', key: GLOBAL_LOADING_KEY });
        }
      }
    }

    return Promise.reject(new Error(errorMessage));
  }

  // 停止加载提示
  if (config.showLoading) {
    stopGlobalLoading();
  }

  return response;
};

/**
 * 响应错误拦截器
 */
const responseErrorInterceptor = (error: AxiosError): Promise<never> => {
  const config = error.config as RequestConfig | undefined;

  // 从待处理队列中移除
  removeFromPendingQueue(config);

  // 停止加载提示
  if (config?.showLoading) {
    stopGlobalLoading();
  }

  // 处理非取消错误
  if (!isCancelError(error)) {
    handleRequestError(error, config);
  }

  // 如果是取消错误，返回一个永远不会resolve的Promise
  if (isCancelError(error)) {
    return new Promise(() => {});
  }

  return Promise.reject(error);
};

// ==================== Axios 实例配置 ====================

/**
 * 获取基础URL
 */
const getBaseUrl = (): string => {
  try {
    const currentUrl = window.location.href;
    const apiBaseUrl = process.env.API_BASE_URL;
    const dsbApiBaseUrl = process.env.DSB_API_BASE_URL;

    // 开发环境或特定域名使用API_BASE_URL，否则使用DSB_API_BASE_URL
    if (IS_DEV || currentUrl.includes('.17an')) {
      return apiBaseUrl || dsbApiBaseUrl || '';
    }

    return dsbApiBaseUrl || apiBaseUrl || '';
  } catch (error) {
    // 如果获取失败，使用默认的API_BASE_URL
    return process.env.API_BASE_URL || '';
  }
};

/**
 * 创建Axios实例
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getBaseUrl(),
    timeout: DEFAULT_TIMEOUT,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
  });

  // 添加拦截器
  instance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor,
  );
  instance.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor,
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

// ==================== 请求方法工厂 ====================

/**
 * 创建参数类型的请求方法（GET、DELETE）
 */
const createParamsMethod = (method: 'get' | 'delete') => {
  return async <T = any>(
    url: string,
    params?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.request<ApiResponse<T>>({
      ...config,
      params,
      method,
      url,
    });
    return response.data;
  };
};

/**
 * 创建数据类型的请求方法（POST、PUT、PATCH）
 */
const createDataMethod = (method: 'post' | 'put' | 'patch') => {
  return async <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.request<ApiResponse<T>>({
      ...config,
      method,
      url,
      data,
    });
    return response.data;
  };
};

// ==================== 导出接口 ====================

export interface MessageProvider {
  add?: (opts: any) => any;
  remove?: (opts: any) => any;
  clear?: () => void;
  error?: (text: string) => void;
  success?: (text: string) => void;
  loading?: (opts: any) => any;
  destroy?: (key?: string) => void;
}

export interface LoadingProvider {
  add?: () => any;
  remove?: (target?: any) => void;
  clear?: () => void;
  start?: () => any;
  stop?: (instance?: any) => void;
}
// ==================== 类型导出 ====================

/**
 * 请求工具类型
 */
export type Request = typeof request;
// export interface Request {
//   setMessageProvider: (provider: any) => void;
//   setLoadingProvider: (provider: any) => void;
//   get: <T = any>(url: string, params?: any, config?: any) => Promise<any>;
//   delete: <T = any>(url: string, params?: any, config?: any) => Promise<any>;
//   post: <T = any>(url: string, data?: any, config?: any) => Promise<any>;
//   put: <T = any>(url: string, data?: any, config?: any) => Promise<any>;
//   patch: <T = any>(url: string, data?: any, config?: any) => Promise<any>;
//   fullRequest: <T = any>(config: RequestConfig) => Promise<import('axios').AxiosResponse>;
//   cancelAllRequests: () => void;
//   getRequestState: () => { loadingCount: number; pendingCount: number };
//   hasPendingRequests: () => boolean;
// }

export const request = {
  setMessageProvider,
  setLoadingProvider,
  /** GET请求 */
  get: createParamsMethod('get'),

  /** DELETE请求 */
  delete: createParamsMethod('delete'),

  /** POST请求 */
  post: createDataMethod('post'),

  /** PUT请求 */
  put: createDataMethod('put'),

  /** PATCH请求 */
  patch: createDataMethod('patch'),

  /**
   * 完整的请求方法，支持自定义配置
   */
  async fullRequest<T = any>(
    config: RequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.request<ApiResponse<T>>(config);
  },

  /**
   * 取消所有待处理的请求
   */
  cancelAllRequests(): void {
    requestState.pendingRequests.forEach((controller) => {
      controller.abort();
    });
    requestState.pendingRequests.clear();
    requestState.loadingCount = 0;
    try {
      if (messageProviderInstance && typeof messageProviderInstance.destroy === 'function') {
        messageProviderInstance.destroy(GLOBAL_LOADING_KEY);
      }
    } catch {
      // ignore
    }
  },

  /**
   * 获取当前请求状态
   */
  getRequestState(): { loadingCount: number; pendingCount: number } {
    return {
      loadingCount: requestState.loadingCount,
      pendingCount: requestState.pendingRequests.size,
    };
  },

  /**
   * 检查是否有待处理的请求
   */
  hasPendingRequests(): boolean {
    return requestState.pendingRequests.size > 0;
  },
};



// ==================== 全局错误处理 ====================

/**
 * 防止取消请求的错误被作为未处理的Promise拒绝
 */
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (isCancelError(event.reason)) {
      event.preventDefault();
    }
  });
}

export default request;
