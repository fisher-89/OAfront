import { fetchCustomer } from '../services/customer';

export default {
  namespace: 'tableClients',

  state: {
    tableResult: {},
    totalResult: {},
    total: 0,
  },

  effects: {
    * fetchCustomer({ payload }, { call, put, select }) {
      try {
        const params = { ...payload };
        const oldResponse =
          yield select(model => model.tableClients.tableResult[JSON.stringify(params)]);
        if (oldResponse === undefined || params.update) {
          let response = [];
          response = yield call(fetchCustomer, params, '');
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

