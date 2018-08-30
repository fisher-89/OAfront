
import { fetchClientLogs } from '../../services/customer';

const store = 'clientLogs';

export default {
  * fetchClientLogs({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchClientLogs, params);
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
