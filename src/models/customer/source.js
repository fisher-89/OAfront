
import { fetchSource, addSource, editSource, deleteSource } from '../../services/customer';

const store = 'source';

export default {
  * fetchSource(_, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model.customer[store]);
      if (!response.length) {
        response = yield call(fetchSource);
      }
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addSource({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addSource, params);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'add',
        payload: {
          store,
          data: response,
        },
      });
      if (response.message) { return; }
      onSuccess(response);
    } catch (err) { return err; }
  },
  * editSource({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(editSource, params, id);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'update',
        payload: {
          id,
          store,
          data: response,
        },
      });
      if (response.message) { return; }
      onSuccess(response);
    } catch (err) { return err; }
  },
  * deleteSource({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(deleteSource, id);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'delete',
        payload: { id, store, data: response },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
};
