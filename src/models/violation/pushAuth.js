import {
  fetchPushAuth,
  addPushAuth,
  editPushAuth,
  deletePushAuth,
} from '../../services/violation';

const store = 'pushauth';
export default {
  *fetchPushAuth({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchPushAuth, params, id || '');
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

  *addPushAuth({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addPushAuth, params);
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

  *editPushAuth({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = payload;
      delete params.id;
      const response = yield call(editPushAuth, params, id);
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
    } catch (err) { return err; }
  },

  *deletePushAuth({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deletePushAuth, id);
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
