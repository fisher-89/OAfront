import {
  fetchTargets,
  addTargets,
  editTargets,
  deleteTargets,
} from '../../../services/point';

const store = 'targets';
/**
 * effects
 */
export default {
  * fetchTargets({ payload }, { call, put, select }) {
    try {
      let response = yield select(model => model.point[store]);
      if (!response.length) {
        response = yield call(fetchTargets, '');
      }
      const params = { ...payload };
      let { id } = params;
      delete params.id;
      if (!id) {
        ([{ id }] = response);
      }
      const targetInfo = yield call(fetchTargets, id);
      yield put({
        type: 'save',
        payload: {
          store,
          id,
          data: targetInfo,
        },
      });
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) {
      return err;
    }
  },
  * addTargets({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addTargets, params);
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
  * editTargets({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editTargets, params, id);
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
  * deleteTargets({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteTargets, id);
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
