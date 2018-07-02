import {
  fetchType,
  addType,
  editType,
  deleteType,
  sorterType,
} from '../../../services/point';

const store = 'type';

export default {
  * fetchType(_, { call, put }) {
    try {
      const response = yield call(fetchType);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * sorterType({ payload, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(sorterType, params);
      if (response.message && onError) {
        onError(response.message);
        return;
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
  * addType({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addType, params);
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
  * editType({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editType, params, id);
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
  * deleteType({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteType, id);
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
