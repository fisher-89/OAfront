import {
  fetchStaffViolation,
  editStaffPayment,
  downloadDepartmentExcel,
} from '../../services/violation';

const store = 'staffviolation';
export default {
  * fetchStaffViolation({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchStaffViolation, params, id || '');
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

  *editStaffPayment({ payload, onError, onSuccess }, { call, put }) {
    try {
      const response = yield call(editStaffPayment, payload);
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

  *editSinglePayment({ payload, onError, onSuccess }, { call, put }) {
    try {
      const response = yield call(editStaffPayment, payload);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'update',
          payload: {
            store,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (err) { return err; }
  },

  *downloadDepartmentExcel({ payload, onError, onSuccess }, { call }) {
    try {
      const response = yield call(downloadDepartmentExcel, payload);
      if (response.errors) {
        return onError();
      }
      onSuccess(response);
    } catch (err) { return err; }
  },

};

