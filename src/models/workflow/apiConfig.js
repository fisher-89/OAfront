import {
  getApiConfig,
  fetchApiConfig,
  addApiConfig,
  editApiConfig,
  deleteApiConfig,
  testApiConfig,
} from '../../services/workflow';

const store = 'apiConfig';

export default {
  *testApiConfig({ payload, onSuccess }, { call }) {
    try {
      const params = { ...payload };
      const response = yield call(testApiConfig, params);
      onSuccess(response);
    } catch (e) { return e; }
  },
  * fetchApiConfig({ payload }, { call, put, select }) {
    try {
      let response = yield select(model => model.workflow[store]);
      const { update } = payload || {};
      if (!response.length || update) {
        response = yield call(fetchApiConfig);
        yield put({
          type: 'save',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (e) { return e; }
  },
  *getApiConfig({ payload }, { call, put, select }) {
    try {
      const { id } = payload;
      let response = yield select(model => model.workflow.apiConfigDetails[id]);
      const { update } = payload || {};
      if (!response || update) {
        response = yield call(getApiConfig, id);
        yield put({
          type: 'save',
          payload: {
            id,
            store,
            data: response,
          },
        });
      }
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
