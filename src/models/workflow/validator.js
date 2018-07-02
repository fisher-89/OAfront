import { fetchValidator, addValidator, editValidator, deleteValidator } from '../../services/workflow';

const store = 'validator';

export default {
  * fetchValidator({ payload }, { call, put }) {
    const params = {
      ...payload,
    };
    const response = yield call(fetchValidator, params);
    yield put({
      type: 'save',
      payload: {
        store,
        data: response,
      },
    });
  },
  * addValidator({ payload, onSuccess, onError }, { call, put }) {
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
  },
  * editValidator({ payload, onSuccess, onError }, { call, put }) {
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
  },
  * deleteValidator({ payload }, { call, put }) {
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
  },
};
