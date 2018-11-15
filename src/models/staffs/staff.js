import {
  fetchStaff,
  fetchStaffInfo,
  addStaff,
  editStaff,
  deleteStaff,
  importStaff,
  exportStaff,
  resetPassword,
  againEntry,
  unlock,
  process,
  transfer,
  leave,
  leaving,
  fetchStaffLog,
  fetchBespokeStaff,
} from '../../services/user';

const store = 'staff';

export default {
  * fetchStaffLog({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchStaffLog, params.id || '');
      yield put({
        type: 'save',
        payload: {
          data: response,
          store: 'staffLog',
          staffSn: params.id,
        },
      });
    } catch (err) {
      return err;
    }
  },
  * fetchBespokeStaff({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchBespokeStaff, params.id || '');
      yield put({
        type: 'save',
        payload: {
          data: response,
          staffSn: params.id,
          store: 'staffBespoke',
        },
      });
    } catch (err) {
      return err;
    }
  },
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
  * addStaff({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addStaff, params);
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
    } catch (err) {
      return err;
    }
  },
  * editStaff({ payload, onSuccess, onError }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      const params = { ...payload };
      const response = yield call(editStaff, params, staffSn);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'update',
          payload: {
            store,
            staff_sn: staffSn,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (err) {
      return err;
    }
  },
  * deleteStaff({ payload }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      const response = yield call(deleteStaff, staffSn);
      yield put({
        type: 'delete',
        payload: {
          store,
          staff_sn: staffSn,
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
  * resetPassword({ payload, onSuccess, onError }, { call }) {
    try {
      const staffSn = payload.staff_sn;
      const response = yield call(resetPassword, staffSn);
      if (response.error && onError) {
        onError(response.error);
      } else {
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
  * againEntry({ payload, onSuccess, onError }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      const response = yield call(againEntry, payload);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'merge',
          payload: {
            store,
            staff_sn: staffSn,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
  * unlock({ payload }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      const response = yield call(unlock, staffSn);
      yield put({
        type: 'merge',
        payload: {
          store,
          staff_sn: staffSn,
          data: response,
        },
      });
    } catch (error) {
      return error;
    }
  },
  * process({ payload, onSuccess, onError }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      const response = yield call(process, payload);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'merge',
          payload: {
            store,
            staff_sn: staffSn,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
  * transfer({ payload, onSuccess, onError }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      const response = yield call(transfer, payload);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'merge',
          payload: {
            store,
            staff_sn: staffSn,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
  * leave({ payload, onSuccess, onError }, { call, put }) {
    try {
      const staffSn = payload.staff_sn;
      const response = yield call(leave, payload);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'merge',
          payload: {
            store,
            staff_sn: staffSn,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
  * leaving({ payload, onSuccess, onError }, { call }) {
    try {
      const response = yield call(leaving, payload);
      if (!response.status && onError) {
        onError(response);
      } else {
        onSuccess(response);
      }
    } catch (error) {
      return error;
    }
  },
};
