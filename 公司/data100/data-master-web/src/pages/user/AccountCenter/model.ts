import { Reducer, Effect } from 'umi';
import { message } from 'antd';
import { loginOut } from '@/components/RightContent/AvatarDropdown';
import { CurrentUser } from './data.d';
import { queryCurrent, updataCurrent, updataCurrentPwd } from './service';

export interface ModalState {
  currentUser: Partial<CurrentUser>;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetchCurrent: Effect;
    fetchUpdataCurrent: Effect;
    fetchUpdataCurrentPwd: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'userAndAccountCenter',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchUpdataCurrent(_, { call, select }) {
      const { currentUser } = yield select((current: any) => current.userAndAccountCenter);
      try {
        yield call(updataCurrent, {...currentUser.data, ..._.params});
        message.success('修改成功');
      } catch (error) {
        message.error(error.response.msg);
      }
      
    },
    *fetchUpdataCurrentPwd(_, { call }) {
      const params = {
        oldPassword: _.params.oldPassword,
        newPassword: _.params.newPassword1
      }
      try {
        yield call(updataCurrentPwd, params);
        message.success('修改成功，请重新登录！');
        setTimeout(() => {
          loginOut();
        }, 500);
      } catch (error) {
        message.error(error.response.msg);
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...(state as ModalState),
        currentUser: action.payload || {},
      };
    },
  },
};

export default Model;
