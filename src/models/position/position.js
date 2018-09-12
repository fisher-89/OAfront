import {
  fetchPosition,
  addPosition,
  editPosition,
  deletePosition,
} from '../../services/position';

const store = 'position';

export default {
  * fetchPosition({ payload }, { call, put, select }) {
    try {
      const { update } = payload || {};
      let response = yield select(model => model[store][store]);
      if (!response.length || update) {
        response = yield call(fetchPosition);
        yield put({
          type: 'save',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (err) {
      return err;
    }
  },
  * addPosition({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addPosition, params);
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
    } catch (error) {
      return error;
    }
  },
  * editPosition({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = payload;
      const response = yield call(editPosition, params, id);
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
    } catch (error) {
      return error;
    }
  },
  * deletePosition({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deletePosition, id);
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
    } catch (error) {
      return error;
    }
  },
};
