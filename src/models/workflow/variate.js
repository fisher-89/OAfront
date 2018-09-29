import { fetchVariate } from '../../services/workflow';

const store = 'variate';

export default {
  * fetchVariate({ payload }, { call, put, select }) {
    let response = yield select(model => model.workflow[store]);
    const { update } = payload || {};
    if (!Object.keys(response).length || update) {
      response = yield call(fetchVariate);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    }
  },
};
