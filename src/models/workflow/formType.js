import {
  notification,
} from 'antd';
import { fetchFormType, addFormType, editFormType, deleteFormType } from '../../services/workflow';

const store = 'formType';

export default {
  * fetchFormType({ payload }, { call, put }) {
    const params = {
      ...payload,
    };
    const response = yield call(fetchFormType, params);
    yield put({
      type: 'save',
      payload: {
        store,
        data: response,
      },
    });
  },
  * addFormType({ payload, onSuccess, onError }, { call, put }) {
    const params = {
      ...payload,
    };
    const response = yield call(addFormType, params);
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
  * editFormType({ payload, onSuccess, onError }, { call, put }) {
    const params = {
      ...payload,
    };
    const { id } = payload;
    delete params.id;
    const response = yield call(editFormType, params, id);
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
  * deleteFormType({ payload }, { call, put }) {
    const { id } = payload;
    const response = yield call(deleteFormType, id);
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
