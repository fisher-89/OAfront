import {
  fetchFineDepartment,
} from '../../services/violation';

const store = 'finedepartment';
export default {
  *fetchFineDepartment({ payload }, { call, put }) {
    try {
      const response = yield call(fetchFineDepartment, payload);
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
