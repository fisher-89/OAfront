import { fetchBrand } from '../../services/brand';

const store = 'all';

export default {
  * fetchBrandAll({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchBrand, params);
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
