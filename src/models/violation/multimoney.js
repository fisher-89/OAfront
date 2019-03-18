import {
  fetchFineMoney,
} from '../../services/violation';

const store = 'multimoney';
export default {
  *fetchMultiFineMoney({ payload }, { call, put }) {
    try {
      const response = yield call(fetchFineMoney, payload);
      const now = new Date();
      const time = now.getTime();
      const money = { ...response, time };
      yield put({
        type: 'save',
        payload: {
          store,
          data: money,
        },
      });
    } catch (err) { return err; }
  },
};

