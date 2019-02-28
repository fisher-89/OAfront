import {
  fetchDingGroup,
} from '../../services/violation';

const store = 'dinggroup';
export default {
  *fetchDingGroup({ payload }, { call, put }) {
    try {
      const response = yield call(fetchDingGroup, payload);
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
};
