import { fetchPosition } from '../../services/position';

const store = 'position';

export default {
  * fetchPosition(_, { call, put, select }) {
    try {
      const result = yield select(model => model.position.position);
      if (!result.length) {
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
