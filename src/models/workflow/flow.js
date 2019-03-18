import {
  flowRunFormVersion,
  flowClone,
  fetchFlow,
  addFlow,
  editFlow,
  deleteFlow,
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
      if (response.message) {
        return;
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
