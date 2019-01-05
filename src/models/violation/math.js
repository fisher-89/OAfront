import {
  fetchMath,
  fetchOperator,
} from '../../services/violation';

const store = 'math';

export default {
  *fetchMath({ payload }, { call, put, select }) {
    try {
      let math = yield select(model => model.violation[store]);
      let operator = yield select(model => model.violation[store]);
      math = yield call(fetchMath, payload);
      operator = yield call(fetchOperator, payload);
      const fullmath = { math, operator };
      yield put({
        type: 'save',
        payload: {
          store,
          data: fullmath,
        },
      });
    } catch (err) { return err; }
  },
};
