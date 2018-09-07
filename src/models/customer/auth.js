
import { fetchAuth, addAuth, editAuth, deleteAuth } from '../../services/customer';

const store = 'auth';

export default {
  * fetchAuth({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchAuth, params, id || '');
      if (response.message) { return; }
      yield put({
        type: 'save',
        payload: {
          id,
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addAuth({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addAuth, params);
      if (response.errors) { onError(response.errors); return; }
      if (response.message) { return; }
      yield put({
        type: 'add',
        payload: {
          store,
          data: response,
        },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
  * editAuth({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(editAuth, params, id);
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
  * deleteAuth({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(deleteAuth, id);
      if (response.errors) { onError(response.errors); return; }
      if (response.message) { return; }
      yield put({
        type: 'delete',
        payload: { id, store },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
};
