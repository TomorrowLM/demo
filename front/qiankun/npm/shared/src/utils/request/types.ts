/*
 * @Descripttion:
 * @version:
 * @Author: wuhj
 * @Date: 2025-08-30 17:39:35
 * @LastEditors: wuhj
 * @LastEditTime: 2025-10-10 16:24:34
 */
/**
 * 通用接口响应结构
 * @template T 业务数据类型
 */
export interface ApiResponse<T = any> {
  /** 状态码 */
  code?: number | string;

  /** 是否成功 */
  success?: boolean;

  /** 提示信息 */
  msg?: string;

  /** 错误信息（存在异常时返回） */
  error?: string;

  /** 业务数据（数组场景常用） */
  datas?: T;

  /** 业务数据（对象场景常用） */
  data?: T;

  /** 总条数（分页场景） */
  total?: number;

  /** 数据条数（部分接口返回） */
  count?: number;

  /** 其他未知字段 */
  [key: string]: any;
}

/**
 * 分页查询参数
 */
export interface PageQueryParams {
  /** 页码 */
  pageNo?: number;

  /** 每页条数 */
  pageSize?: number;
}
