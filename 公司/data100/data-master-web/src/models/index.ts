

import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';


export interface IndexModelState {
  refreshTime: string,//上次拉取surveyCool问卷的时间
  reload:any,
  isRefresh:boolean,//是否展示刷新按钮
}

export interface IndexModelType {
  namespace: 'rightContent';
  state: IndexModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<IndexModelState>;
    setRefreshTime:Reducer<IndexModelState>,
    changeRefreshState:Reducer<IndexModelState>,
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'rightContent',

  state: {
    refreshTime: '',
    reload:null,
    isRefresh:true
  },

  effects: {//处理异步逻辑
    *query({ payload }, { call, put }) {
      console.log({ payload }, { call, put })
    },
  },
  reducers: {//同步更新
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setRefreshTime(state:any, action){
      // console.log(state,action)
      return {
        ...state,
        ...action.payload,
      };
    },
    changeRefreshState(state:any, action){
      return{
        ...state,
        ...action.payload,
      }
    }
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  subscriptions: {//订阅
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        console.log(pathname)
        if (pathname === '/') {
          dispatch({
            type: 'query',
          });
        }else if(pathname === '/survey/list'||pathname === '/folder'){
          dispatch({
            type: 'setRefreshTime',
          });
          dispatch({
            type: 'changeRefreshState',
            payload: {
              isRefresh:true,
            }
          })
        }else{
          dispatch({
            type: 'changeRefreshState',
            payload: {
              isRefresh:false,
            }
          })
        }
      });
    },
  },
};

export default IndexModel;