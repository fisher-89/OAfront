import { fetchShop } from '../services/shop';

export default {
  namespace: 'tableShop',

  state: {
    tableResult: {},
    totalResult: {},
    total: 0,
  },

  effects: {
    * fetchShop({ payload }, { call, put, select }) {
      try {
        const params = { ...payload };
        delete params.update;
        const oldResponse =
          yield select(model => model.tableShop.tableResult[JSON.stringify(params)]);
        if (oldResponse === undefined || payload.update) {
          let response = [];
          response = yield call(fetchShop, params, '');
          yield put({
            type: 'addTableResult',
            payload: {
              params,
              data: response.data,
            },
          });
          yield put({
            type: 'setTalbleTotal',
            payload: {
              params,
              total: response.total,
            },
          });
        }
      } catch (err) { return err; }
    },
  },

  reducers: {
    addTableResult(state, action) {
      const { params, data } = action.payload;
      return {
        ...state,
        tableResult: {
          ...state.tableResult,
          [JSON.stringify(params)]: data,
        },
      };
    },
    setTalbleTotal(state, action) {
      const { params, total } = action.payload;
      return {
        ...state,
        totalResult: {
          ...state.totalResult,
          [JSON.stringify(params)]: total,
        },
      };
    },
  },
};

