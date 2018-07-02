import { fetchShop } from '../../services/shop';

const store = 'shop';

export default {
  * fetchShop({ payload }, { call, put }) {
    try {
      const params = payload;
      const response = yield call(fetchShop, params);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response.data,
        },
      });
      yield put({
        type: 'setTotal',
        payload: {
          total: response.total,
          filtered: response.filtered,
        },
      });
    } catch (err) { return err; }
  },
};
