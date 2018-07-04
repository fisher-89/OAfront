import { query } from '../../services/department';

const store = 'department';

export default {
  * fetchDepartment({ payload }, { call, put }) {
    try {
      const result = yield select(model => model.department.department);
      if (!result.length) {
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
