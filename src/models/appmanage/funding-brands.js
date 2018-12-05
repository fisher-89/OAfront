import {
  fetchReimDepartment,
  deleteReimDepartment,
  addReimDepartment,
  editReimDepartment,
} from '../../services/appmanage';

const store = 'reimdepartment';
export default {
  * fetchReimDepartment({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchReimDepartment, params);
      if (response.message) { return; }
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addReimDepartment({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const midkey = {
        ...payload,
      };
      params.cashier_sn = midkey.cashier_sn.cashier_sn;
      params.cashier_name = midkey.cashier_sn.cashier_name;
      params.manager_sn = midkey.manager_sn.manager_sn;
      params.manager_name = midkey.manager_sn.manager_name;
      const response = yield call(addReimDepartment, params);
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
  * editReimDepartment({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const midkey = {
        ...payload,
      };
      params.cashier_sn = midkey.cashier_sn.cashier_sn;
      params.cashier_name = midkey.cashier_sn.cashier_name;
      params.manager_sn = midkey.manager_sn.manager_sn;
      params.manager_name = midkey.manager_sn.manager_name;
      const { id } = payload;
      delete params.id;
      const response = yield call(editReimDepartment, params, id);
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
  * deleteReimDepartment({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteReimDepartment, id);
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
