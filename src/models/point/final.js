
import { notification } from 'antd';
import {
  fetchFinal,
  addFinal,
  editFinal,
  deleteFinal,
} from '../../services/point';

const store = 'final';

export default {
  * fetchFinal({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchFinal, params, id || '');
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addFinal({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addFinal, params);

      if ((response.errors && onError) || response.message) {
        const { message } = response;
        onError(response.errors || {}, message || null);
        return;
      }
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
  * editFinal({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editFinal, params, id);

      if ((response.errors && onError) || response.message) {
        const { message } = response;
        onError(response.errors || {}, message || null);
        return;
      }
      yield put({
        type: 'update',
        payload: {
          store,
          id,
          data: response,
        },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
  * deleteFinal({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteFinal, id);
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
