import { countFine } from '../../services/violation';

const store = 'count';

export default {
  * fetchCount({ payload }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(countFine, params);
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
