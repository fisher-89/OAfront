import { fetchBrand } from '../../services/brand';

const store = 'brand';

export default {
  * fetchBrand(_, { call, put }) {
    try {
      const response = yield call(fetchBrand);
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
