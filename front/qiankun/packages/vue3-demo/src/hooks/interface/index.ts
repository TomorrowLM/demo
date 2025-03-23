/*
 * @Author: 徐小玉
 * @Date: 2024-09-27 17:19:52
 * @LastEditors: xxy xiaoyu.xu@cisdi.com.cn
 * @LastEditTime: 2024-10-09 13:25:54
 * @FilePath: \dedust_advanced_web\src\hooks\interface\index.ts
 * @Description:
 */
export namespace Table {
	export interface Pageable {
		pageNum: number;
		pageSize: number;
		total: number;
	}
	export interface StateProps {
		tableData: any[];
		pageable: Pageable;
		searchParam: {
			[key: string]: any;
		};
		initSearchParam: {
			[key: string]: any;
		};
		searchHandledParam: {
			[key: string]: any;
		};
		// totalParam: {
		// 	[key: string]: any;
		// };
		icon?: {
			[key: string]: any;
		};
	}
}

export namespace HandleData {
	export type MessageType = "" | "success" | "warning" | "info" | "error";
}
