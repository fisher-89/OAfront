import {
  fetchFineScore,
} from '../../services/violation';

const store = 'multiscore';
export default {
  *fetchMultiFineScore({ payload }, { call, put }) {
    try {
      const response = yield call(fetchFineScore, payload);
      const now = new Date();
      const time = now.getTime();
      const score = { ...response, time };
      yield put({
        type: 'save',
        payload: {
          store,
          data: score,
        },
      });
    } catch (err) { return err; }
  },
};

