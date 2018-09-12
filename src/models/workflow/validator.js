import { fetchValidator, addValidator, editValidator, deleteValidator } from '../../services/workflow';

const store = 'validator';

export default {
  * fetchValidator({ payload }, { call, put, select }) {
    try {
      const params = { ...payload };
      const { update } = params;
      delete params.update;
      let response = yield select(model => model.workflow[store]);
      if (!response.length || update) {
        response = yield call(fetchValidator, params);
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
  * addValidator({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addValidator, params);
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
  * editValidator({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editValidator, params, id);
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
  * deleteValidator({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteValidator, id);
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
