
import { fetchTagsType, addTagsType, editTagsType, deleteTagsType } from '../../services/customer';

const store = 'tagsType';

export default {
  * fetchTagsType({ payload }, { call, put, select }) {
    try {
      const { update } = payload || {};
      let response = yield select(model => model.customer[store]);
      if (!response.length || update) {
        response = yield call(fetchTagsType);
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
  * addTagsType({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addTagsType, params);
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
  * editTagsType({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(editTagsType, params, id);
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
  * deleteTagsType({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(deleteTagsType, id);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'delete',
        payload: { id, store, data: response },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
};
