import { fetchForm, addForm, editForm, deleteForm } from '../../services/workflow';

const store = 'form';

export default {
  * fetchForm({ payload }, { call, put }) {
    const { id } = payload;
    const params = {
      ...payload,
    };
    delete params.id;
    const response = yield call(fetchForm, params, id || '');
    yield put({
      type: 'save',
      payload: {
        store,
        id,
        data: response,
      },
    });
  },
  * addForm({ payload, onSuccess, onError }, { call, put }) {
    const params = {
      ...payload,
    };
    const response = yield call(addForm, params);
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
  * editForm({ payload, onSuccess, onError }, { call, put }) {
    const { id } = payload;
    const params = {
      ...payload,
    };
    delete params.id;
    const response = yield call(editForm, params, id);
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
  * deleteForm({ payload }, { call, put }) {
    const { id } = payload;
    const response = yield call(deleteForm, id);
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
