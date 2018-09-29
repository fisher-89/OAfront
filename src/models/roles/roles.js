import { query } from '../../services/roles';

const store = 'roles';

export default {
  * fetchRoles({ payload }, { call, put, select }) {
    try {
      const { id } = payload;
      const params = {
        ...payload,
      };
      delete params.id;
      let response = yield select(model => model[store][store]);
      const { update } = payload || {};
      if (!response.length || update) {
        response = yield call(query, params, id || '');
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
