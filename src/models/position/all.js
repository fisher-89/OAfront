import { fetchPosition } from '../../services/position';

const store = 'all';

export default {
  * fetchPositionAll({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchPosition, params);
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
