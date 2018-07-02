import staffEffects from './staff';
import staffReducers from '../reducers/staff';

export default {
  namespace: 'staffs',
  state: {
    staff: [],
    staffDetails: {},
    tableResult: {},
    totalResult: {},
    total: 0,
  },
  effects: {
    ...staffEffects,
  },
  reducers: {
    ...staffReducers,
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
