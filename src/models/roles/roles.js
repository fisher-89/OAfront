import { query } from '../../services/roles';

const store = 'roles';

export default {
  * fetchRoles({ payload }, { call, put }) {
    try {
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
    } catch (err) { return err; }
  },
};
