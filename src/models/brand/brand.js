import { fetchBrand } from '../../services/brand';

const store = 'brand';

export default {
  * fetchBrand({ update }, { call, put, select }) {
    try {
      const result = yield select(model => model[store][store]);
      if (!result.length || update) {
        const response = yield call(fetchBrand);
        yield put({
          type: 'save',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (err) {
      return err;
    }
  },
};
