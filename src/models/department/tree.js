import { fetchTreeDepart } from '../../services/department';

const store = 'tree';

export default {
  * fetchTreeDepart({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchTreeDepart, params);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) {
      return err;
    }
  },
};
