import { query } from '../../services/department';

const store = 'department';

export default {
  * fetchDepartment({ payload, update }, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model[store][store]);
      const { id } = payload;
      const params = {
        ...payload,
      };
      delete params.id;
      if (!response.length || update || id) {
        response = yield call(query, params, id || '');
      }
      yield put({
        type: 'save',
        payload: {
          store,
          id,
          data: response,
        },
      });
    } catch (err) {
      return err;
    }
  },
};
