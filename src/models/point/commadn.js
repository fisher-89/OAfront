import {
  fetchCommadnLog,
} from '../../services/point';

const store = 'commadnLog';

export default {
  * fetchCommadnLog({ payload }, { call, put }) {
    try {
      const params = payload;
      const response = yield call(fetchCommadnLog, params);
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
