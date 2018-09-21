import {
  fetchStaff,
  fetchStaffInfo,
  editStaff,
  deleteStaff,
  importStaff,
  exportStaff,
} from '../../services/user';

const store = 'staff';

export default {
  * fetchStaff({ payload }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      const params = { ...payload };
      const response = yield call(fetchStaff, params);
      if (staffSn) {
        yield put({
          type: 'save',
          payload: {
            store,
            staffSn,
            data: response,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (err) {
      return err;
    }
  },
  * fetchStaffForSearchTable({ payload }, { call, put, select }) {
    try {
      const staffSn = payload.staff_sn;
      const params = {
        ...payload,
      };
      delete params.staff_sn;
      delete params.update;
      const oldResponse = yield select(state => state.staffs.tableResult[JSON.stringify(params)]);
      if (staffSn !== undefined || oldResponse === undefined || payload.update) {
        let response = [];
        response = yield call(fetchStaff, params);
        if (staffSn) {
          yield put({
            type: 'save',
            payload: {
              store,
              staffSn,
              data: response,
            },
          });
        } else {
          yield put({
            type: 'addTableResult',
            payload: {
              params,
              data: response.data,
            },
          });
          yield put({
            type: 'setTalbleTotal',
            payload: {
              params,
              total: response.total,
            },
          });
          yield put({
            type: 'combine',
            payload: {
              store,
              data: response.data,
            },
          });
        }
      }
    } catch (err) {
      return err;
    }
  },
  * fetchStaffInfo({ payload }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      if (staffSn !== undefined) {
        let response = [];
        response = yield call(fetchStaffInfo, staffSn);
        yield put({
          type: 'save',
          payload: {
            store,
            staffSn,
            data: response,
          },
        });
      }
    } catch (err) {
      return err;
    }
  },
  * editStaff({ payload }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      const params = {
        ...payload,
      };
      if (staffSn !== undefined) {
        let response = [];
        response = yield call(editStaff, params);
        yield put({
          type: 'update',
          payload: {
            store,
            staffSn,
            data: response,
          },
        });
      }
    } catch (err) {
      return err;
    }
  },
  * deleteStaff({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteStaff, id);
      yield put({
        type: 'delete',
        payload: {
          store,
          id,
          data: response,
        },
      });
    } catch (err) {
      return err;
    }
  },
  * importStaff({ payload, onSuccess, onError }, { call }) {
    try {
      const params = { ...payload };
      const response = yield call(importStaff, params);
      if (response.errors && onError) {
        onError(response);
      } else {
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
  * exportStaff({ payload, onSuccess, onError }, { call }) {
    try {
      const params = { ...payload };
      const response = yield call(exportStaff, params);
      if (response.errors && onError) {
        onError(response);
      } else {
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
};
