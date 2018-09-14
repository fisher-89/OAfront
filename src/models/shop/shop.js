import { notification } from 'antd';
import {
  fetchShop,
  addShop,
  editShop,
  deleteShop,
  positionShop } from '../../services/shop';


const store = 'shop';

export default {
  * fetchShop({ payload }, { call, put, select }) {
    try {
      const { update } = payload || {};
      let response = yield select(model => model[store][store]);
      if (!response.length || update) {
        response = yield call(fetchShop, payload);
        yield put({
          type: 'save',
          payload: {
            store,
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
  * addShop({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addShop, params);
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
    } catch (error) { return error; }
  },
  * editShop({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = payload;
      const response = yield call(editShop, params, id);
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
    } catch (error) { return error; }
  },
  * deleteShop({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteShop, id);
      if (response.error) {
        notification({
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
    } catch (error) { return error; }
  },
  * positionShop({ payload, onSuccess, onError }, { call }) {
    try {
      const params = { ...payload };
      const response = yield call(positionShop, params);
      if (response.code === '0' && onError) {
        notification.error({
          message: response.message,
        });
      } else {
        onSuccess(response);
      }
    } catch (error) { return error; }
  },
};
