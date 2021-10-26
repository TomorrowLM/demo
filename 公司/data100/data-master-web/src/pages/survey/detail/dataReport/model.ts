

import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';


export interface IndexModelState {
  listData:Array<any>,//统计分析列表数据,
  surveyGroup:string,
}

export interface IndexModelType {
  namespace: 'surveyDetail';
  state: IndexModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<IndexModelState>;
    // setRefreshTime:Reducer<IndexModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'surveyDetail',

  state: {
    listData:[],
    surveyGroup:''
  },

  effects: {
    *query({ payload }, { call, put }) {
      console.log({ payload }, { call, put })
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    // setRefreshTime(state:any, action){
    //   return {
    //     ...state,
    //     ...action.payload,
    //   };
    // }
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        console.log(pathname)
        // if (pathname === '/') {
        //   dispatch({
        //     type: 'query',
        //   });
        // }else 
        if(pathname === '/list/detail/dataReport'){
          dispatch({
            type: 'save',
          });
        }
      });
    },
  },
};

export default IndexModel;