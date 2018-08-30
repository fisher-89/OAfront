
import { fetchNoteLogs } from '../../services/customer';

const store = 'noteLogs';

export default {
  * fetchNoteLogs({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchNoteLogs, params);
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
