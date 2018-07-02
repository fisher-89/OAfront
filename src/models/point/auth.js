import {
  fetchAuth,
  addAuth,
  editAuth,
  deleteAuth,
} from '../../services/point';

const store = 'auth';
/**
 * effects
 */
export default {
  * fetchAuth({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchAuth, params, id || '');
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addAuth({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
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
    } catch (err) { return err; }
  },
  * editAuth({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
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
    } catch (err) { return err; }
  },
  * deleteAuth({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteAuth, id);
      if (response.error) {
        notification.error({
          message: '删除失败',
          description: response.error,
        });
      } else {
        yield put({
          type: 'delete',
          payload: {
            store,
            id,
          },
        });
      }
    } catch (err) { return err; }
  },
};
