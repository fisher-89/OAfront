import {
  fetchFineLog,
  editFineLog,
  addFineLog,
  deleteFineLog,
  editPayState,
  downloadExcelFinLog,
} from '../../services/violation';

const store = 'finelog';
export default {
  * fetchFineLog({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchFineLog, params, id || '');
      if (response.message) { return; }
      yield put({
        type: 'save',
        payload: {
          id,
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },

  *addFineLog({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addFineLog, params);
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

  *editFineLog({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = payload;
      delete params.id;
      const response = yield call(editFineLog, params, id);
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

  *editPayState({ payload, onError, onSuccess }, { call, put }) {
    try {
      const response = yield call(editPayState, payload);
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
        onSuccess(response);
      }
    } catch (err) { return err; }
  },

  *deleteFineLog({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteFineLog, id);
      yield put({
        type: 'delete',
        payload: {
          store,
          id,
          data: response,
        },
      });
    } catch (error) {
      return error;
    }
  },


  *downloadExcelFinLog({ payload, onError, onSuccess }, { call }) {
    try {
      const response = yield call(downloadExcelFinLog, payload);
      if (response.errors) {
        return onError();
      }

      onSuccess(response);
    } catch (err) { return err; }
  },
};
