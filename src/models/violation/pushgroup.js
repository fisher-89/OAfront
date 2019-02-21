import {
  fetchPushQun,
  editPushQun,
} from '../../services/violation';

const store = 'pushgroup';
export default {
  *fetchPushQun({ payload }, { call, put }) {
    try {
      const response = yield call(fetchPushQun, payload);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response.data,
        },
      });
    } catch (err) { return err; }
  },

  *editPushQun({ payload }, { call, put }) {
    try {
      const response = yield call(editPushQun, payload);
      yield put({
        type: 'groupupdate',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
};

