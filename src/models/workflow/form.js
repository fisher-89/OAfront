import {
  formVersion, fetchOldForm, fetchForm, addForm, editForm, deleteForm, getFormList,
} from '../../services/workflow';

const store = 'form';

export default {
  * formVersion({ payload, onError }, { call, put, select }) {
    try {
      const params = { ...payload };
      let response = yield select(models => models.workflow.formVersionDetails[params.id]);
      if (response) return;
      response = yield call(formVersion, params.id || '');
      if (response.errors) {
        onError(response.errors);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          id: params.id,
          data: response,
          store: 'formV',
        },
      });
    } catch (err) { return err; }
  },
  * fetchOldForm({ payload }, { call, put, select }) {
    try {
      const { id, update } = payload;
      let response = yield select(model => model.workflow.oldFormDetails[id]);
      if (!response || update) {
        response = yield call(fetchOldForm, id || '');
        yield put({
          type: 'save',
          payload: {
            id,
            store: 'oldForm',
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
  * fetchForm({ payload }, { call, put }) {
    try {
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
    } catch (err) { return err; }
  },
  * addForm({ payload, onSuccess, onError }, { call, put }) {
    const params = {
      ...payload,
    };
    try {
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
    } catch (err) { return err; }
  },
  * editForm({ payload, onSuccess, onError }, { call, put }) {
    const { id } = payload;
    const params = {
      ...payload,
    };
    delete params.id;
    try {
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
    } catch (err) { return err; }
  },
  * deleteForm({ payload }, { call, put }) {
    const { id } = payload;
    try {
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
    } catch (err) { return err; }
  },
  // 获取表单列表（不带权限）
  * formList({ payload }, { call, put }) {
    const response = yield call(getFormList, payload);
    yield put({
      type: 'save',
      payload: {
        store: 'formList',
        data: response,
      },
    });
  },
};
