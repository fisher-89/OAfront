import { fetchVariate } from '../../services/workflow';

const store = 'variate';

export default {
  * fetchVariate(_, { call, put }) {
    const response = yield call(fetchVariate);
    yield put({
      type: 'save',
      payload: {
        store,
        data: response,
      },
    });
  },
};
