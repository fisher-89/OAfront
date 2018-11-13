
import { fetchClientLogs, clientReduction } from '../../services/customer';

const store = 'clientLogs';

export default {
  * fetchClientLogs({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      delete params.clientId;
      const response = yield call(fetchClientLogs, params);
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
            store,
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
  * clientReduction({ payload, onSuccess, onError }, { call, put }) {
    try {
      const { id } = { ...payload };
      if (id) {
        const response = yield call(clientReduction, id);
        if (response.error) { onError(response.error); return; }
        yield put({
          type: 'update',
          payload: {
            store,
            data: response,
            id: response.id,
          },
        });
        onSuccess(response);
      }
    } catch (err) { return err; }
  },
};
