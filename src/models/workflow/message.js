import { fetchWaitMsg, fetchWorkMsg } from '../../services/workflow';


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
