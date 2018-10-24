
import {
  avatar,
  card,
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
  * downloadExcelCustomer({ payload, onError, onSuccess }, { call }) {
    try {
      const response = yield call(downloadExcelCustomer, payload);
      if (response.errors) {
        return onError();
      }
      onSuccess(response);
    } catch (err) { console.log(err); return err; }
  },
  * avatar({ payload, onSuccess, onError }, { call }) {
    try {
      const response = yield call(avatar, payload);
      if (typeof response === 'object' && response.errors) {
        onError(response.errors);
        return;
      }
      if (onSuccess) onSuccess(response);
    } catch (err) { return err; }
  },
  * card({ payload, onSuccess, onError }, { call }) {
    try {
      const response = yield call(card, payload);
      if (typeof response === 'object' && response.errors) {
        onError(response.errors);
        return;
      }
      if (onSuccess) onSuccess(response);
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
