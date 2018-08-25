import { notification } from 'antd';
import {
  fetchProcessingReimbursements,
  fetchOvertimeReimbursements,
  fetchApprovedReimbursements,
  fetchRejectedReimbursements,
  fetchPackageReimbursements,
  fetchUnpaidReimbursements,
  fetchPaidReimbursements,
  approveByAccountant,
  rejectByAccountant,
  sendReimbursementPackages,
  fetchAllFundsAttribution,
  fetchAllReimbursementStatus,
} from '../services/finance';
import reducers from './reducers';

export default {
  namespace: 'reimbursement',
  state: {
    processingList: [],
    overtimeList: [],
    approvedList: [],
    rejectedList: [],
    packageList: [],
    unPaidList: [],
    paidList: [],
    detailInfo: {},
    fundsAttribution: [],
    status: [],
  },

  effects: {
    * fetchProcessingList({ payload }, { call, put }) {
      try {
        const response = yield call(fetchProcessingReimbursements, payload);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'processingList',
              data: response,
            },
          });
        }
      } catch (err) {
        return err;
      }
    },
    * fetchOvertimeList({ payload }, { call, put }) {
      try {
        const response = yield call(fetchOvertimeReimbursements, payload);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'overtimeList',
              data: response,
            },
          });
        }
      } catch (err) {
        return err;
      }
    },
    * fetchApprovedList({ payload }, { call, put }) {
      try {
        const response = yield call(fetchApprovedReimbursements, payload);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'approvedList',
              data: response,
            },
          });
        }
      } catch (err) {
        return err;
      }
    },
    * fetchRejectedList({ payload }, { call, put }) {
      try {
        const response = yield call(fetchRejectedReimbursements, payload);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'rejectedList',
              data: response,
            },
          });
        }
      } catch (err) {
        return err;
      }
    },
    * fetchPackageList({ payload }, { call, put }) {
      try {
        const response = yield call(fetchPackageReimbursements, payload);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'packageList',
              data: response,
            },
          });
        }
      } catch (err) {
        return err;
      }
    },
    * fetchUnPaidList({ payload }, { call, put }) {
      try {
        console.log('model');
        const response = yield call(fetchUnpaidReimbursements, payload);
        console.log(response);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'unPaidList',
              data: response,
            },
          });
        }
      } catch (err) {
        return err;
      }
    },
    * fetchPaidList({ payload }, { call, put }) {
      try {
        const response = yield call(fetchPaidReimbursements, payload);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'paidList',
              data: response,
            },
          });
        }
      } catch (err) {
        return err;
      }
    },
    * approveByAccountant({ payload }, { call, put }) {
      try {
        const response = yield call(approveByAccountant, payload);
        if (response) {
          yield put({
            type: 'afterApproveByAccountant',
            payload: {
              id: payload.id,
              data: response,
            },
          });
          yield put({
            type: 'updateDetail',
            payload: response,
          });
        }
      } catch (err) {
        return err;
      }
    },
    * rejectByAccountant({ payload, onSuccess }, { call, put }) {
      try {
        const response = yield call(rejectByAccountant, payload);
        if (response) {
          yield put({
            type: 'afterRejectByAccountant',
            payload: {
              id: payload.id,
              data: response,
              onSuccess,
            },
          });
          yield put({
            type: 'updateDetail',
            payload: response,
          });
        }
      } catch (err) {
        return err;
      }
    },
    * sendPackages({ payload }, { call, put, select }) {
      try {
        const response = yield call(sendReimbursementPackages, payload);
        console.log(response);
        if (response) {
          const packageList = yield select(state => state.reimbursement.packageList);
          yield put({
            type: 'save',
            payload: {
              store: 'packageList',
              data: packageList.filter(item => payload.id.indexOf(item.id) === -1),
            },
          });
          notification.success({ message: '提交成功' });
        }
      } catch (err) {
        return err;
      }
    },
    * fetchFundsAttribution(_, { call, put }) {
      try {
        const response = yield call(fetchAllFundsAttribution);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'fundsAttribution',
              data: response,
            },
          });
        }
      } catch (err) {
        return err;
      }
    },
    * fetchStatus(_, { call, put }) {
      try {
        const response = yield call(fetchAllReimbursementStatus);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'status',
              data: response,
            },
          });
        }
      } catch (err) {
        return err;
      }
    },
  },

  reducers: {
    ...reducers,
    afterApproveByAccountant(state, action) {
      const { id, data, onSuccess } = action.payload;
      if (data.errors) {
        const errorDescription = Object.keys(data.errors).map((key) => {
          return data.errors[key];
        });
        notification.error({ message: data.message, description: errorDescription });
        return state;
      } else if (data.message) {
        notification.error({ message: data.message });
        return state;
      }
      onSuccess();
      const newState = {
        ...state,
        processingList: state.processingList.filter(item => item.id !== id),
        overtimeList: state.overtimeList.filter(item => item.id !== id),
      };
      return newState;
    },
    afterRejectByAccountant(state, action) {
      const { id, data, onSuccess } = action.payload;
      if (data.errors) {
        const errorDescription = Object.keys(data.errors).map((key) => {
          return data.errors[key];
        });
        notification.error({ message: data.message, description: errorDescription });
        return state;
      } else if (data.message) {
        notification.error({ message: data.message });
        return state;
      }
      onSuccess();
      const newState = {
        ...state,
        processingList: state.processingList.filter(item => item.id !== id),
        overtimeList: state.overtimeList.filter(item => item.id !== id),
      };
      return newState;
    },
    updateDetail(state, { payload }) {
      return {
        ...state,
        detailInfo: payload,
      };
    },
  },
};
