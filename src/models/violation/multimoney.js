import {
  fetchFineMoney,
  deletePreMoney,
  cleanPreTable,
} from '../../services/violation';

const store = 'multimoney';
export default {
  *fetchMultiFineMoney({ payload }, { call, put }) {
    try {
      const { ids } = payload;
      const params = { ...payload };
      delete params.ids;
      const response = yield call(fetchFineMoney, params);
      const now = new Date();
      const time = now.getTime();
      const money = { ...response, time, ids };
      yield put({
        type: 'save',
        payload: {
          store,
          data: money,
        },
      });
    } catch (err) { return err; }
  },

  *deletePreMoney({ payload }, { call }) {
    try {
      yield call(deletePreMoney, payload);
    } catch (err) { return err; }
  },

  *cleanPreTable({ payload }, { call }) {
    try {
      yield call(cleanPreTable, payload);
    } catch (err) { return err; }
  },
};

