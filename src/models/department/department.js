import {
  fetchDepartment,
  addDepartment,
  editDepartment,
  deleteDepartment,
} from '../../services/department';

const store = 'department';

export default {
  * fetchDepartment({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchDepartment, params);
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
  * addDepartment({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addDepartment, params);
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
  * editDepartment({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editDepartment, params, id);
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
    } catch (error) { return error; }
  },
  * deleteDepartment({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteDepartment, id);
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
