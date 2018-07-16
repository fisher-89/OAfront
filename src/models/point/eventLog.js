import {
  fetchEventLog,
  revokeEventLog,
} from '../../services/point';

const store = 'eventLog';

export default {
  * fetchEventLog({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchEventLog, params);
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
    } catch (err) {
      return err;
    }
  },
  * revokeEventLog({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = payload;
      delete params.id;
      const response = yield call(revokeEventLog, params, id);
      if ((response.errors || response.message) && onError) {
        onError(response.errors, response.message);
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
    } catch (err) {
      return err;
    }
  },
  // * exportExcel({ payload }, { call }) {
  //   try {
  //     const { id } = payload;
  //     yield call(exportEvent, id);
  //   } catch (err) {
  //     return err;
  //   }
  // },
};
