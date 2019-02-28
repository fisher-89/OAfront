import {
  fetchBillImage,
} from '../../services/violation';

const store = 'billimage';
export default {
  * fetchBillImage({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchBillImage, params);
      if (response.message) { return; }
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

