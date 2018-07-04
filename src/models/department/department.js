import { query } from '../../services/department';

const store = 'department';

export default {
  * fetchDepartment({ payload, update }, { call, put, select }) {
    try {
      const result = yield select(model => model[store][store]);
      if (!result.length || update) {
        const { id } = payload;
        const params = {
          ...payload,
        };
        delete params.id;
        const response = yield call(query, params, id || '');
        yield put({
          type: 'save',
          payload: {
            store,
            id,
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
};
