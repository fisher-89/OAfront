import {
  fetchAuth,
  addAuth,
  editAuth,
  deleteAuth } from '../../services/authority';

const store = 'authority';

export default {
  * fetchAuth({ payload }, { call, put, select }) {
    try {
      const { update } = payload || {};
      let response = yield select(model => model[store][store]);
      if (!response.length || update) {
        response = yield call(fetchAuth);
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
  * addAuth({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addAuth, params);
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
  * editAuth({ payload, onSuccess, onError }, { call, put }) {
    try {
      const { id } = payload;
      const params = { ...payload };
      const response = yield call(editAuth, params, id);
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
  * deleteAuth({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteAuth, id);
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
