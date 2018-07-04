import { fetchPosition } from '../../services/position';

const store = 'position';

export default {
  * fetchPosition({ update }, { call, put, select }) {
    try {
      const result = yield select(model => model[store][store]);
      if (!result.length || update) {
        const response = yield call(fetchPosition);
        yield put({
          type: 'save',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
};
