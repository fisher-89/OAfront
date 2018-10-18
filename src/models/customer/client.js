
import {
  downloadExcelCustomer,
  fetchCustomer,
  addCustomer,
  editCustomer,
  deleteCustomer,
  customerStaffBrandsAuth,
  downloadExcelTemp,
} from '../../services/customer';

const store = 'customer';

export default {
  * downloadExcelCustomer({ payload }, { call }) {
    try {
      const response = yield call(downloadExcelCustomer, payload);
      if (response) {
        response.blob().then((body) => {
          const blob = new Blob([body]);
          const filename = '客户资料.xls';
          if ('download' in document.createElement('a')) {
            const downloadElement = document.createElement('a');
            let href = '';
            if (window.URL) href = window.URL.createObjectURL(blob);
            else href = window.webkitURL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = filename;
            downloadElement.click();
            if (window.URL) window.URL.revokeObjectURL(href);
            else window.webkitURL.revokeObjectURL(href);
          }
        });
      }
    } catch (err) { return err; }
  },
  * customerStaffBrandsAuth({ payload }, { call, put, select }) {
    try {
      const { update } = payload || {};
      let response = yield select(model => model.customer.staffBrandsAuth);
      if (!response.editable || update) {
        response = yield call(customerStaffBrandsAuth);
        yield put({
          type: 'save',
          payload: {
            data: response,
            store: 'staffBrandsAuth',
          },
        });
      }
    } catch (err) { return err; }
  },
  * fetchCustomer({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchCustomer, params, id || '');
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
  * addCustomer({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addCustomer, params);
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
  * editCustomer({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(editCustomer, params, id);
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
  * deleteCustomer({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(deleteCustomer, id || '');
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'delete',
        payload: { id, store, data: response },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
  * downloadExcelTemp({ onError, onSuccess }, { call }) {
    try {
      const response = yield call(downloadExcelTemp);
      if (response.errors) { onError(response.errors); return; }
      if (response.message) { return; }
      onSuccess(response);
    } catch (err) { return err; }
  },
};
