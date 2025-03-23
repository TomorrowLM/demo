import type { Table } from "./interface";
import { reactive, computed, toRefs, watch } from "vue";
import { cloneDeep } from 'lodash-es'

interface ParamsProps {
	api?: (params: any) => Promise<any>, //获取表格数据 api 方法 (必传)
	searchParam: object, //获取绑定值数据(非必传，默认为{})
	isPageable: boolean, //是否有分页 (非必传，默认为true)
	paramsHandler?: (data: any) => any,//对请求的数据进行处理的方法 (非必传)
	dataCallBack?: (data: any) => any,//	对后台返回的数据进行处理的方法 (非必传)
	requestError?: (error: any) => void//	请求失败之后的回调 (非必传)
}

export const useTable = (
	params: ParamsProps
) => {
	const { api, searchParam = {}, isPageable = true, paramsHandler, dataCallBack, requestError } = params
	const state = reactive<Table.StateProps>({
		// 筛选参数
		searchParam: {},
		// 表格数据
		tableData: [],
		// 分页数据
		pageable: {
			// 当前页数
			pageNum: 1,
			// 每页显示条数
			pageSize: 15,
			// 总条数
			total: 0
		},
		// 初始化默认的查询参数
		initSearchParam: {},
		// 查询参数，不是绑定value的数据，比如时间选择器绑定值和查询参数绑定值是两个东西，这里存放处理之后的查询参数
		searchHandledParam: {},
	});

	/**
	 * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
	 * */
	const pageParam = computed({
		get: () => {
			return {
				pageNum: state.pageable.pageNum,
				pageSize: state.pageable.pageSize
			};
		},
		set: (newVal: any) => {
			console.log("我是分页更新之后的值", newVal);
		}
	});

	state.initSearchParam = cloneDeep(searchParam);
	state.searchParam = searchParam
	/**
	 * @description 获取表格数据
	 * @return void
	 * */
	const getTableList = async (params?: any) => {
		if (!api) return;
		try {
			// 先把初始化参数和分页参数放到总参数里面
			//TODO: searchParam没有响应
			// Object.assign(state.totalParam, searchParam, isPageable ? pageParam.value : {});
			//处理分页
			const requestData = { ...state.searchParam, ...params }
			requestData.current = state.pageable.pageNum;
			requestData.size = state.pageable.pageSize;
			state.searchHandledParam = paramsHandler ? paramsHandler(requestData) : requestData
			console.log(state.searchHandledParam, '我是查询参数')
			let { data } = await api(state.searchHandledParam);
			dataCallBack && (data = dataCallBack(data));
			state.tableData = isPageable ? data.list : data;
			// 解构后台返回的分页数据 (如果有分页更新分页信息)
			if (isPageable) {
				const { pageNum, pageSize, total } = data;
				updatePageable({ pageNum, pageSize, total });
			}
		} catch (error) {
			requestError && requestError(error);
		}
	};

	/**
	 * @description 更新分页信息
	 * @param {Object} pageable 后台返回的分页数据
	 * @return void
	 * */
	const updatePageable = (pageable: Table.Pageable) => {
		Object.assign(state.pageable, pageable);
	};

	/**
	 * @description 表格数据查询
	 * @return void
	 * */
	const search = () => {
		state.pageable.pageNum = 1;
		getTableList();
	};

	/**
	 * @description 表格数据重置
	 * @return void
	 * */
	const reset = () => {
		state.pageable.pageNum = 1
		// 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
		state.searchParam = { ...state.initSearchParam };
		console.log(state.searchParam, state.initSearchParam, '我是初始化参数')
		getTableList();
	};

	/**
	 * @description 每页条数改变
	 * @param {Number} val 当前条数
	 * @return void
	 * */
	const handleSizeChange = (val: number) => {
		state.pageable.pageNum = 1;
		state.pageable.pageSize = val;
		getTableList();
	};

	/**
	 * @description 当前页改变
	 * @param {Number} val 当前页
	 * @return void
	 * */
	const handleCurrentChange = (val: number) => {
		state.pageable.pageNum = val;
		getTableList();
	};

	return {
		...toRefs(state),
		getTableList,
		search,
		reset,
		handleSizeChange,
		handleCurrentChange,
	};
};
