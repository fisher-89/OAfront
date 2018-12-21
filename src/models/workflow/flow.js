import { notification, message } from 'antd';
import {
  flowRunFormVersion,
  flowClone,
  startFlowRunLogExport,
  delay,
  checkFlowRunLogExport,
  fetchFlow,
  addFlow,
  editFlow,
  deleteFlow,
  flowRunLog,
  uploadIcon,
  getFlowList,
} from '../../services/workflow';

const store = 'flow';

export default {
  * flowRunFormVersion({ payload, onError }, { call, put, select }) {
    try {
      const params = { ...payload };
      let response = yield select(models => models.workflow.formVersionDetails[params.id]);
      if (response) return;
      response = yield call(flowRunFormVersion, params.id || '');
      if (response.errors) {
        onError(response.errors);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          id: params.id,
          data: response,
          store: 'formVersion',
        },
      });
    } catch (err) {
      return err;
    }
  },
  * flowClone({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(flowClone, params.id || '');
      if (response.errors) {
        onError(response.errors);
        return;
      }
      yield put({
        type: 'add',
        payload: {
          store,
          message: '克隆成功',
          data: response,
        },
      });
      onSuccess(response);
    } catch (err) {
      return err;
    }
  },
  * flowRunLogExport({ payload }, { call, put }) {
    const params = { ...payload };
    const code = yield call(startFlowRunLogExport, params);
    yield put({
      type: 'save',
      payload: {
        store: 'exportProgress',
        data: 0,
      },
    });
    yield call(delay, 1000);
    yield put({
      type: 'checkRunLogExport',
      payload: { code },
    });
  },
  * checkRunLogExport({ payload }, { call, put }) {
    const { code } = payload;
    const response = yield call(checkFlowRunLogExport, code);
    if (response.type === 'finish') {
      yield put({
        type: 'save',
        payload: {
          store: 'exportProgress',
          data: response.progress,
        },
      });
      location.href = response.url;
      yield call(delay, 3000);
      yield put({
        type: 'save',
        payload: {
          store: 'exportProgress',
          data: null,
        },
      });
    } else if (response.progress) {
      yield call(delay, 1000);
      yield put({
        type: 'checkRunLogExport',
        payload: { code },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'exportProgress',
          data: response.progress,
        },
      });
    } else {
      message.error('遇到未知错误，导出失败');
      yield put({
        type: 'save',
        payload: {
          store: 'exportProgress',
          data: -1,
        },
      });
      yield call(delay, 3000);
      yield put({
        type: 'save',
        payload: {
          store: 'exportProgress',
          data: null,
        },
      });
    }
  },
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
    } catch (err) {
      return err;
    }
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
    } catch (err) {
      return err;
    }
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
    } catch (err) {
      return err;
    }
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
    } catch (err) {
      return err;
    }
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
    } catch (err) {
      return err;
    }
  },
  * uploadIcon({ payload, onSuccess, onError }, { call }) {
    try {
      const response = yield call(uploadIcon, payload);
      if (typeof response === 'object' && response.errors) {
        onError(response.errors);
        return;
      }
      if (onSuccess) onSuccess(response.url);
    } catch (err) {
      return err;
    }
  },
  // 获取流程列表（不带权限）
  * flowList({ payload }, { call, put }) {
    const response = yield call(getFlowList, payload);
    yield put({
      type: 'save',
      payload: {
        store: 'flowList',
        data: response,
      },
    });
  },
};
