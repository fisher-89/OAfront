import {
  fetchStaffViolation,
  editStaffPayment,
  downloadDepartmentExcel,
  downloadStaffExcel,
  editPayState,
} from '../../services/violation';

const store = 'staffviolation';
export default {
  * fetchStaffViolation({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      let filter = {};
      if (params.staff_sn) {
        if (params.filters.length > 0) {
          filter = {
            filters: `${params.filters};month=${params.month};staff_sn=${params.staff_sn};`,
          };
        } else {
          filter = {
            filters: `month=${params.month};staff_sn=${params.staff_sn};`,
          };
        }
      } else if (params.department_id !== 'all') {
        if (params.filters.length > 0) {
          filter = {
            department_id: params.department_id,
            filters: `${params.filters};month=${params.month};`,
          };
        } else {
          filter = {
            department_id: params.department_id,
            filters: `month=${params.month};`,
          };
        }
      } else if (params.filters.length > 0) {
        filter = {
          page: params.page,
          pagesize: params.pagesize,
          filters: `${params.filters};month=${params.month};`,
        };
      } else {
        filter = {
          page: params.page,
          pagesize: params.pagesize,
          filters: `month=${params.month};`,
        };
      }
      const response = yield call(fetchStaffViolation, filter);
      if (response.message) { return; }
      yield put({
        type: 'statisticsfetch',
        payload: {
          params,
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },

  *editSinglePayment({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = payload.id;
      const response = yield call(editStaffPayment, payload);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'paychange',
          payload: {
            params,
            store,
            data: response,
          },
        });
        onSuccess();
      }
    } catch (err) { return err; }
  },

  *singleStaffPay({ params, onError }, { call, put }) {
    try {
      const payload = params.id;
      const response = yield call(editPayState, params);
      if (response.errors && onError) {
        if (response.errors.id) {
          onError(response.errors.id);
        }
      } else {
        yield put({
          type: 'singleStaffMultiPay',
          payload: {
            payload,
            store,
            data: response,
          },
        });
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

  *downloadStaffExcel({ payload, onError, onSuccess }, { call }) {
    try {
      const response = yield call(downloadStaffExcel, payload);
      if (response.errors) {
        return onError();
      }
      onSuccess(response);
    } catch (err) { return err; }
  },

};

