import {
  fetchTaskAuth,
  addTaskAuth,
  editTaskAuth,
  deleteTaskAuth,
} from '../../services/point';

const store = 'taskAuth';
/**
 * effects
 */
export default {
  * fetchTaskAuth({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchTaskAuth, params, id || '');
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addTaskAuth({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addTaskAuth, params);
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
  * editTaskAuth({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(editTaskAuth, params);
      if (response.errors) {
        onError(response.errors);
      } else {
        yield put({
          type: 'updateTaskAuth',
          payload: {
            store,
            admin_sn: response.admin_sn,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (err) {
      return err;
    }
  },
  * deleteTaskAuth({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteTaskAuth, id);
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
