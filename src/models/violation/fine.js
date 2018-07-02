import { fineList } from '../../services/violation';

const store = 'fine';

export default {
  * fetchFine({ payload }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(fineList, params);
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
