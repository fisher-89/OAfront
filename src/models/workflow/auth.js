import { authIndex, authDelete, authStore, authUpdate } from '../../services/workflow';

const store = 'auth';

export default {
  // 获取列表
  * fetchAuthIndex({ payload }, { call, put }) {
    const response = yield call(authIndex, payload);
    yield put({
      type: 'save',
      payload: {
        store,
        data: response,
      },
    });
  },
  // 删除角色
  * authDelete({ payload }, { call, put }) {
    yield call(authDelete, payload);
    yield put({
      type: 'delete',
      payload: {
        store,
        id: payload,
      },
    });
  },
  // 新增
  * authStore({ payload, onSuccess, onError }, { call, put }) {
    try {
      const response = yield call(authStore, payload);
      if (response.errors) {
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
    } catch (e) {
      return e;
    }
  },
  // 编辑
  * authUpdate({ payload, id, onSuccess, onError }, { call, put }) {
    const response = yield call(authUpdate, payload, id);
    if (response.errors) {
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
  },
};
