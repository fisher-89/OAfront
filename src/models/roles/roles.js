import {
  query,
  addRole,
  editRole,
  deleteRole,
} from '../../services/roles';

const store = 'roles';

export default {
  * fetchRoles({ payload }, { call, put, select }) {
    try {
      const params = { ...payload };
      let response = yield select(model => model[store][store]);
      const { update } = payload || {};
      if (!response.length || update) {
        response = yield call(query, params);
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
  * addRole({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addRole, params);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'add',
          payload: {
            store,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
  * editRole({ payload, onSuccess, onError }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(editRole, payload, id);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'update',
          payload: {
            store,
            id,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
  * deleteRole({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteRole, id);
      yield put({
        type: 'delete',
        payload: {
          store,
          id,
          data: response,
        },
      });
    } catch (error) {
      return error;
    }
  },
};
