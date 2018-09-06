import {
  fetchBrand,
  addBrand,
  editBrand,
  deleteBrand } from '../../services/brand';

const store = 'brand';

export default {
  * fetchBrand({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchBrand, params);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addBrand({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addBrand, params);
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
  * editBrand({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = payload;
      const response = yield call(editBrand, params, id);
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
  * deleteBrand({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteBrand, id);
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
};
