import staffEffects from './staff';
import staffReducers from '../reducers/staff';

export default {
  namespace: 'staffs',
  state: {
    staff: [],
    staffDetails: {},
    staffLogDetails: {},
    staffBespokeDetails: {},
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
    deleteBespoke(state, action) {
      const { id } = action.payload;
      const staffSn = action.payload.staff_sn;
      const { staffBespokeDetails } = state;
      const data = staffBespokeDetails[staffSn].filter(item => id === item.id);
      return {
        ...state,
        staffBespokeDetails: {
          ...staffBespokeDetails,
          [staffSn]: data,
        },
      };
    },
  },
};
