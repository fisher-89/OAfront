import { fetchPosition } from '../../services/position';

const store = 'position';

export default {
  * fetchPosition({ update }, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model[store][store]);
      if (!response.length || update) {
        response = yield call(fetchPosition);
      }
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
