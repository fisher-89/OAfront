import {
  fetchStaffTagCategories,
  addStaffTagCategories,
  editStaffTagCategories,
  deleteStaffTagCategories,
} from '../../services/hrtags';

const store = 'stafftagtypes';
export default {
  *fetchStaffTagCategories({ payload }, { call, put, select }) {
    try {
      let response = yield select(model => model.stafftags[store]);
      response = yield call(fetchStaffTagCategories, payload);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },

  *addStaffTagCategories({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addStaffTagCategories, params);
      if (response.errors) { onError(response.errors); return; }
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

  *editStaffTagCategories({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(editStaffTagCategories, params, id);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'update',
        payload: {
          id,
          store,
          data: response,
        },
      });
      if (response.message) { return; }
      onSuccess(response);
    } catch (err) { return err; }
  },

  *deleteStaffTagCategories({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(deleteStaffTagCategories, id);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'delete',
        payload: { id, store, data: response },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
};

