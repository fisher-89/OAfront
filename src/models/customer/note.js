
import { fetchNotes, addNotes, editNotes, deleteNotes } from '../../services/customer';

const store = 'notes';

export default {
  * fetchNotes({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      delete params.clientId;
      const response = yield call(fetchNotes, params, id || '');
      if (payload.clientId) {
        yield put({
          type: 'saveLog',
          payload: {
            store,
            data: response,
            id: payload.clientId,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            id,
            store,
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
  * addNotes({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(addNotes, params);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'add',
        payload: {
          store,
          data: response,
        },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
  * editNotes({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(editNotes, params, id);
      if (response.errors) { onError(response.errors); return; }
      yield put({
        type: 'update',
        payload: {
          id,
          store,
          data: response,
        },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
  * deleteNotes({ payload, onError, onSuccess }, { call, put }) {
    try {
      const params = { ...payload };
      const { id, clientId } = params;
      const response = yield call(deleteNotes, id);
      if (response.errors) { onError(response.errors); return; }
      if (clientId) {
        yield put({
          type: 'deletedLog',
          payload: { id, store, clientId },
        });
      }
      yield put({
        type: 'delete',
        payload: { id, store, data: response },
      });
      onSuccess(response);
    } catch (err) { return err; }
  },
};
