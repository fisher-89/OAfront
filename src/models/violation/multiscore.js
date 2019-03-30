import {
  fetchFineScore,
} from '../../services/violation';

const store = 'multiscore';
export default {
  *fetchMultiFineScore({ payload }, { call, put }) {
    try {
      const { ids } = payload;
      const params = { ...payload };
      delete params.ids;
      const response = yield call(fetchFineScore, params);
      const now = new Date();
      const time = now.getTime();
      const score = { ...response, time, ids };
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

