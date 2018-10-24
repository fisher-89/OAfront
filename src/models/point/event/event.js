import {
  fetchEvent,
  addEvent,
  editEvent,
  deleteEvent,
  importEvent,
  exportEvent,
} from '../../../services/point';

const store = 'event';

export default {
  * fetchEvent({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchEvent, params);
      if (response.errors) {
        return;
      }
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addEvent({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addEvent, params);
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
  * editEvent({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editEvent, params, id);
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
  * deleteEvent({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteEvent, id);
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
  * importExcel({ payload }, { call }) {
    try {
      const { id } = payload;
      yield call(importEvent, id);
    } catch (err) { return err; }
  },
  * exportEvent({ payload, onSuccess, onError }, { call }) {
    try {
      const { id } = payload;
      const response = yield call(exportEvent, id);
      if (response.errors && onError) return onError(response.errors);
      onSuccess(response);
    } catch (err) { return err; }
  },
};
