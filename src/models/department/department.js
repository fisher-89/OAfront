import {
  fetchDepart,
  addDepart,
  editDepart,
  deleteDepart,
} from '../../services/department';

const store = 'department';

export default {
  * fetchDepart({ update }, { call, put, select }) {
    try {
      let response = yield select(model => model[store][store]);
      if (!response.length || update) {
        response = yield call(fetchDepart);
      }
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
  * addDepart({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addDepart, params);
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
  * editDepart({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editDepart, params, id);
      if (response.errors && onErrors) {
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
    } catch (error) { return error; }
  },
  * deleteDepart({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteDepart, id);
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
    } catch (error) { return error; }
  },
};
