import { fetchPosition } from '../../services/position';

const store = 'position';

export default {
  * fetchPosition(_, { call, put }) {
    try {
      const response = yield call(fetchPosition);
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
