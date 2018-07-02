import {
  fetchPointLog,
} from '../../services/point';

const store = 'pointLog';

export default {
  * fetchPointLog({ payload }, { call, put }) {
    try {
      const params = payload;
      const response = yield call(fetchPointLog, params);
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
