import { message } from 'antd';
import {
  checkFlowRunLogExport,
  delay,
  flowRunFormVersion,
  flowRunLog,
  formVersion,
  startFlowRunLogExport,
} from '../../services/workflow';


const store = 'flowRunLog';

export default {
  * flowFormVersion({ payload }, { call, put }) {
    const response = yield call(flowRunFormVersion, payload);
    yield put({
      type: 'save',
      payload: {
        store: 'flowFormVersion',
        data: response,
      },
    });
  },
  * fetchFormVersion({ payload }, { call, put }) {
    const response = yield call(formVersion, payload);
    yield put({
      type: 'save',
      payload: {
        store: 'fetchFormVersion',
        data: response,
      },
    });
  },
  * flowRunLog({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(flowRunLog, params);
      yield put({
        type: 'save',
        payload: {
          data: response,
          store,
        },
      });
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
};
