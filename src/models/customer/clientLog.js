
import { fetchClientLogs, clientReduction } from '../../services/customer';

const store = 'clientLogs';

export default {
  * fetchClientLogs({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchClientLogs, params);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
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
            id,
            store,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (err) { return err; }
  },
};
