
import { fetchCustomer, addCustomer, editCustomer, deleteCustomer } from '../../services/customer';

const store = 'customer';

export default {
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
      if (response.message) { return; }
      yield put({
        type: 'add',
        payload: {
          store,
          data: response,
        },
      });
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
      if (response.message) { return; }
      yield put({
        type: 'edit',
        payload: {
          id,
          store,
          data: response,
        },
      });
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
      if (response.message) { return; }
      yield put({
        type: 'delete',
        payload: { id, store },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
};
