import {
  fetchApprovers,
  addApprovers,
  editApprovers,
  deleteApprovers,
} from '../../services/appmanage';

const store = 'approver';
export default {
  * fetchApprovers({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchApprovers, params);
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
  * addApprovers({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const midkey = {
        ...payload,
      };
      params.department_id = midkey.department_id.department_id;
      const response = yield call(addApprovers, params);
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
  * editApprovers({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const midkey = {
        ...payload,
      };
      params.department_id = midkey.department_id.department_id;
      const { id } = payload;
      delete params.id;
      const response = yield call(editApprovers, params, id);
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
  * deleteApprovers({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteApprovers, id);
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
