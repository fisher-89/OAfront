import { fetchNation } from '../services/nation';
import defaultReducers from './reducers';

export default {
  namespace: 'nation',
  state: {
    list: [],
  },
  effects: {
    * fetchNation({ update }, { call, put, select }) {
      try {
        let response;
        response = yield select(model => model.nation.list);
        if (!response.length || update) {
          response = yield call(fetchNation);
        }
        yield put({
          type: 'save',
          payload: {
            store: 'list',
            data: response,
          },
        });
      } catch (err) { return err; }
    },
  },
  reducers: {
    ...defaultReducers,
  },
};
