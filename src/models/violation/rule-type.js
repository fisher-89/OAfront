import {
  fetchRuleType,

} from '../../services/violation';

const store = 'ruletype';
export default {
  *fetchRuleType({ payload }, { call, put, select }) {
    try {
      let response = yield select(model => model.violation[store]);
      response = yield call(fetchRuleType, payload);
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
