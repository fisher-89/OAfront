import { notification } from 'antd';
import {
  fetchShop,
  addShop,
  editShop,
  exportShop,
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
      const shopSn = payload.shop_sn;
      const response = yield call(editShop, params, shopSn);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'update',
          payload: {
            store,
            shopSn,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (error) { return error; }
  },
  * deleteShop({ payload }, { call, put }) {
    try {
      const shopSn = payload.shop_sn;
      yield call(deleteShop, shopSn);
      yield put({
        type: 'delete',
        payload: {
          store,
          shopSn,
        },
      });
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
  * exportShop({ payload, onSuccess, onError }, { call }) {
    try {
      const params = { ...payload };
      const response = yield call(exportShop, params);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        onSuccess(response);
      }
    } catch (error) { return error; }
  },
};
