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
    deleteBespoke(state, { payload }) {
      const { id, data } = payload;
      const staffSn = payload.staff_sn;
      const { staffBespokeDetails } = state;
      const newData = staffBespokeDetails[staffSn].map((item) => {
        if (item.id === id) {
          return { ...item, ...data };
        } else {
          return item;
        }
      });
      return {
        ...state,
        staffBespokeDetails: {
          ...staffBespokeDetails,
          [staffSn]: newData,
        },
      };
    },
  },
};
