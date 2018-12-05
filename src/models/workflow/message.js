import { notification } from 'antd';
import { fetchWaitMsg, fetchWorkMsg, resendWaitMsg, resendWorkMsg } from '../../services/workflow';

export default {
  * fetchWaitMsg({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchWaitMsg, params);
      yield put({
        type: 'save',
        payload: {
          store: 'waitMsg',
          data: response,
        },
      });
    } catch (e) { return e; }
  },
  * resendWaitMsg({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(resendWaitMsg, params.id || '');
      if (response.errcode) {
        notification.error({ message: '发送失败' });
        return;
      }
      yield put({
        type: 'update',
        payload: {
          store: 'waitMsg',
          id: params.id,
          message: '发送成功',
          data: response,
        },
      });
    } catch (e) { return e; }
  },
  * resendWorkMsg({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(resendWorkMsg, params.id || '');
      yield put({
        type: 'update',
        payload: {
          store: 'workMsg',
          id: params.id,
          data: response,
        },
      });
    } catch (e) { return e; }
  },
  * fetchWorkMsg({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchWorkMsg, params);
      yield put({
        type: 'save',
        payload: {
          store: 'workMsg',
          data: response,
        },
      });
    } catch (e) { return e; }
  },
};
