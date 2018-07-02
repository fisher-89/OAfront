import {
  notification,
} from 'antd';
import { fetchFlowType, addFlowType, editFlowType, deleteFlowType } from '../../services/workflow';

const store = 'flowType';

export default {
  * fetchFlowType({ payload }, { call, put }) {
    const params = {
      ...payload,
    };
    const response = yield call(fetchFlowType, params);
    yield put({
      type: 'save',
      payload: {
        store,
        data: response,
      },
    });
  },
  * addFlowType({ payload, onSuccess, onError }, { call, put }) {
    const params = {
      ...payload,
    };
    const response = yield call(addFlowType, params);
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
  * editFlowType({ payload, onSuccess, onError }, { call, put }) {
    const params = {
      ...payload,
    };
    const { id } = payload;
    delete params.id;
    const response = yield call(editFlowType, params, id);
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
  * deleteFlowType({ payload }, { call, put }) {
    const { id } = payload;
    const response = yield call(deleteFlowType, id);
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
