import { fetchApprover, addApprover, editApprover, deleteApprover } from '../../services/workflow';

const store = 'approver';

export default {
  * fetchApprover({ payload }, { call, put, select }) {
    try {
      const params = { ...payload };
      const { update, id } = params;
      let response = yield select(model => model.workflow[store]);
      if (!response.length || update) {
        response = yield call(fetchApprover, id || '');
        yield put({
          type: 'save',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (e) {
      return e;
    }
  },
  * addApprover({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addApprover, params);
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
    } catch (e) {
      return e;
    }
  },
  * editApprover({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editApprover, params, id);
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
    } catch (e) {
      return e;
    }
  },
  * deleteApprover({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteApprover, id);
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
    } catch (e) {
      return e;
    }
  },
};
