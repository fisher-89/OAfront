import { notification } from 'antd';
import { fetchFlow, addFlow, editFlow, deleteFlow, flowRunLog } from '../../services/workflow';

const store = 'flow';

export default {
  * flowRunLog({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(flowRunLog, params);
      yield put({
        type: 'save',
        payload: {
          data: response,
          store: 'flowRunLog',
        },
      });
    } catch (err) { return err; }
  },
  * fetchFlow({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const params = {
        ...payload,
      };
      delete params.id;
      const response = yield call(fetchFlow, params, id || '');
      yield put({
        type: 'save',
        payload: {
          store,
          id,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addFlows({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addFlow, params);
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
    } catch (err) { return err; }
  },
  * editFlow({ payload, onSuccess, onError }, { call, put }) {
    try {
      const { id } = payload;
      const params = {
        ...payload,
      };
      delete params.id;
      const response = yield call(editFlow, params, id);
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
  * deleteFlow({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteFlow, id);
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
