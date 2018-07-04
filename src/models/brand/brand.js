import { fetchBrand } from '../../services/brand';

const store = 'brand';

export default {
  * fetchBrand(_, { call, put }) {
    try {
      const result = yield select(model => model[store].department);
      if (!result.length) {
        const response = yield call(fetchBrand);
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
