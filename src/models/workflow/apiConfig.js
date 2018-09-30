import { fetchApiConfig, addApiConfig, editApiConfig, deleteApiConfig } from '../../services/workflow';

const store = 'apiConfig';

export default {
  * fetchApiConfig({ payload }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(fetchApiConfig, params);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (e) { return e; }
  },
  * addApiConfig({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addApiConfig, params);
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
    } catch (e) { return e; }
  },
  * editApiConfig({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editApiConfig, params, id);
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
    } catch (e) { return e; }
  },
  * deleteApiConfig({ payload, onError, onSuccess }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteApiConfig, id);
      if (response.errors) { onError(response.errors); }
      yield put({
        type: 'delete',
        payload: {
          store,
          id,
        },
      });
      onSuccess(response);
    } catch (e) { return e; }
  },
};
