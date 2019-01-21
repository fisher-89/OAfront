import { notification } from 'antd';
import {
  fetchRuleType,
  addRuleType,
  editRuleType,
  deleteRuleType,
} from '../../services/violation';

const store = 'ruletype';
export default {
  *fetchRuleType({ payload }, { call, put, select }) {
    try {
      let response = yield select(model => model.violation[store]);
      response = yield call(fetchRuleType, payload);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },

  *addRuleType({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addRuleType, params);
      if (response.errors && onError) {
        notification.error({ message: response.errors.name });
        return;
      }
      yield put({
        type: 'add',
        payload: {
          store,
          data: response,
        },
      });
      if (response.message) { return; }
      onSuccess(response);
    } catch (err) { return err; }
  },

  *editRuleType({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = payload;
      delete params.id;
      const response = yield call(editRuleType, params, id);
      if (response.errors && onError) {
        notification.error({ message: response.errors.name });
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

  *deleteRuleType({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteRuleType, id);
      yield put({
        type: 'delete',
        payload: {
          store,
          id,
          data: response,
        },
      });
    } catch (error) {
      return error;
    }
  },

};
