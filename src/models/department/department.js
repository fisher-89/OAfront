import {
  fetchDepartment,
  addDepartment,
  editDepartment,
  deleteDepartment,
  sortDepartment,
  fetchCategory,
  addCategory,
  editCategory,
  deleteCategory,
} from '../../services/department';

const store = 'department';
const cates = 'category';

export default {
  * fetchDepartment({ payload }, { call, put, select }) {
    try {
      const { update } = payload || {};
      let response = yield select(model => model[store][store]);
      if (!response.length || update) {
        response = yield call(fetchDepartment, payload);
        yield put({
          type: 'save',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
  * addDepartment({ payload, onSuccess, onError }, { call, put }) {
    try {
      const response = yield call(addDepartment, payload);
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
      const { id } = payload;
      const response = yield call(editDepartment, payload, id);
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
  * sortDepartment({ payload, onError }, { call, put }) {
    try {
      const response = yield call(sortDepartment, payload);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'multiupdate',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (error) { return error; }
  },
  * deleteDepartment({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteDepartment, id);
      yield put({
        type: 'delete',
        payload: {
          store,
          id,
          data: response,
        },
      });
    } catch (error) { return error; }
  },
  * fetchCategory({ payload }, { call, put, select }) {
    try {
      const { update } = payload || {};
      let response = yield select(model => model[store][cates]);
      if (!response.length || update) {
        response = yield call(fetchCategory, payload);
        yield put({
          type: 'save',
          payload: {
            store: cates,
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
  * addCategory({ payload, onSuccess, onError }, { call, put }) {
    try {
      const response = yield call(addCategory, payload);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'add',
          payload: {
            store: cates,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (err) { return err; }
  },
  * editCategory({ payload, onSuccess, onError }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(editCategory, payload, id);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'update',
          payload: {
            store: cates,
            id,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (error) { return error; }
  },
  * deleteCategory({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteCategory, id);
      yield put({
        type: 'delete',
        payload: {
          store: cates,
          id,
          data: response,
        },
      });
    } catch (error) { return error; }
  },
};
