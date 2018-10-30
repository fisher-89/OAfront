import {
  fetchExpense,
  addExpense,
  editExpense,
  deleteExpense,
} from '../../services/expense';

const store = 'expense';
export default {
  * fetchExpense({ payload }, { call, put, select }) {
    try {
      const { update } = payload || {};
      let response = yield select(model => model[store][store]);
      if (!response.length || update) {
        response = yield call(fetchExpense);
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
  * addExpense({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addExpense, params);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'add',
        payload: {
          store,
          data: response,
        },
      });
      if (response.message) { return; }
      onSuccess(response);
    } catch (err) { return err; }
  },
  * editExpense({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(editExpense, params, id);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'update',
        payload: {
          id,
          store,
          data: response,
        },
      });
      if (response.message) { return; }
      onSuccess(response);
    } catch (err) { return err; }
  },
  * deleteExpense({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteExpense, id);
      yield put({
        type: 'delete',
        payload: {
          store,
          id,
          data: response,
        },
      });
      onSuccess(response);
    } catch (error) {
      return error;
    }
  },
};
