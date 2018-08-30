import { fetchStaff, fetchStaffInfo, editStaff, deleteStaff } from '../../services/user';

const store = 'staff';

export default {
  * fetchStaff({ payload }, { call, put, select }) {
    try {
      const staffSn = payload.staff_sn;
      const params = {
        ...payload,
      };
      delete params.staff_sn;
      const oldResponse = yield select(state => state.staffs.tableResult[JSON.stringify(params)]);
      if (staffSn !== undefined || oldResponse === undefined) {
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
    } catch (err) { return err; }
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
    } catch (err) { return err; }
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
    } catch (err) { return err; }
  },
  * deleteStaff({ payload }, { call, put }) {
    try {
      const id = payload.staff_sn;
      const response = yield call(deleteStaff, id);
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
