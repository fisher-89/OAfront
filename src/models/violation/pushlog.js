import {
  fetchPushLog,
} from '../../services/violation';

const store = 'pushlog';
export default {
  * fetchPushLog({ payload }, { call, put }) {
    try {
      const response = yield call(fetchPushLog, payload);
      if (response.message) { return; }
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
};
