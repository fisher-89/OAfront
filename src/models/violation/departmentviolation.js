import {
  fetchDepartmentViolation,
} from '../../services/violation';

const store = 'departmentviolation';
export default {
  * fetchDepartmentViolation({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchDepartmentViolation, params, id || '');
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

};

