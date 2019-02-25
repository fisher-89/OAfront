import {
  fetchMyPushLog,
} from '../../services/violation';

const store = 'mypushlog';
export default {
  * fetchMyPushLog({ payload }, { call, put }) {
    try {
      const response = yield call(fetchMyPushLog, payload);
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
