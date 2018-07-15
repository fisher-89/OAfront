import { fetchBrand } from '../../services/brand';

const store = 'brand';

export default {
  * fetchBrand({ update }, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model[store][store]);
      if (!response.length || update) {
        response = yield call(fetchBrand);
      }
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
