import {
  fetchApprover,
  addStepDepartment,
  editStepDepartment,
  deleteStepDepartment,
} from '../../services/workflow';

const store = 'stepDepartment';

export default {
  * fetchStepDepartment({ payload }, { call, put, select }) {
    try {
      const params = { ...payload };
      const { update, id } = params;
      let response = yield select(model => model.workflow[store][id] || []);
      if (!response.length || update) {
        response = yield call(fetchApprover, id || '');
        yield put({
          type: 'saveStepDepartmentData',
          payload: {
            id,
            store,
            data: response.departments || [],
          },
        });
      }
    } catch (e) {
      return e;
    }
  },
  * addStepDepartment({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addStepDepartment, params);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'addStepDepartmentData',
          payload: {
            store,
            data: response,
            id: response.step_approver_id,
          },
        });
        onSuccess(response);
      }
    } catch (e) {
      return e;
    }
  },
  * editStepDepartment({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editStepDepartment, params, id);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'updateStepDepartmentData',
          payload: {
            id,
            store,
            data: response,
            modeId: response.step_approver_id,
          },
        });
        onSuccess(response);
      }
    } catch (e) {
      return e;
    }
  },
  * deleteStepDepartment({ payload }, { call, put }) {
    try {
      const { id, modeId } = payload;
      const response = yield call(deleteStepDepartment, id);
      if (response.error) {
        notification.error({
          message: '删除失败',
          description: response.error,
        });
      } else {
        yield put({
          type: 'deleteStepDepartmentData',
          payload: {
            store,
            id,
            modeId,
          },
        });
      }
    } catch (e) {
      return e;
    }
  },
};

