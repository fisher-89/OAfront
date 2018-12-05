import {
  fetchRule,

} from '../../services/violation';

const store = 'rule';
export default {
  *fetchRule({ payload }, { call, put, select }) {
    try {
      let response = yield select(model => model.violation[store]);
      response = yield call(fetchRule, payload);
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
