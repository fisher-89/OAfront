import { query } from '../../services/roles';

const store = 'roles';

export default {
  * fetchRoles({ payload }, { call, put, select }) {
    try {
      let response = yield select(model => model[store][store]);
      const { update } = payload || {};
      if (!response.length || update) {
        response = yield call(query, payload, '');
        yield put({
          type: 'save',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
};
