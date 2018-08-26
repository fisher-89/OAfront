import { query } from '../../services/department';

const store = 'department';

export default {
  * fetchDepartment({ update }, { call, put, select }) {
    try {
      let response = yield select(model => model[store][store]);
      if (!response.length || update) {
        response = yield call(query);
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
