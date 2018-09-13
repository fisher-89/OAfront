import { notification } from 'antd';
import {
  fetchProcessingReimbursements,
  fetchOvertimeReimbursements,
  fetchExportApprovedReimbursements,
  fetchApprovedReimbursements,
  fetchRejectedReimbursements,
  fetchPackageReimbursements,
  fetchUnpaidReimbursements,
  fetchPaidReimbursements,
  fetchExportPaidReimbursements,
  approveByAccountant,
  rejectByAccountant,
  sendReimbursementPackages,
  withdrawReimbuserment,
  payReimbursements,
  rejectReimbursementByCashier,
  fetchAllFundsAttribution,
  fetchAllReimbursementStatus,
  fetchAllExpenseTypes,
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
    expenseTypes: [],
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
    * exportApprovedList({ payload, onSuccess }, { call }) {
      try {
        const response = yield call(fetchExportApprovedReimbursements, payload);
        if (response) {
          onSuccess(response);
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
        const response = yield call(fetchUnpaidReimbursements, payload);
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
    * exportPaidList({ payload, onSuccess }, { call }) {
      try {
        const response = yield call(fetchExportPaidReimbursements, payload);
        if (response) {
          onSuccess(response);
        }
      } catch (err) {
        return err;
      }
    },
    * approveByAccountant({ payload, onSuccess }, { call, put, select }) {
      try {
        const response = yield call(approveByAccountant, payload);
        if (response) {
          yield put({
            type: 'afterApproveByAccountant',
            payload: {
              id: payload.id,
              data: response,
              onSuccess,
            },
          });
          const detailInfo = yield select(state => state.reimbursement.detailInfo);
          if (response.id === parseInt(detailInfo.id, 10)) {
            yield put({
              type: 'updateDetail',
              payload: response,
            });
          }
        }
      } catch (err) {
        return err;
      }
    },
    * rejectByAccountant({ payload, onSuccess }, { call, put, select }) {
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
          const detailInfo = yield select(state => state.reimbursement.detailInfo);
          if (response.id === parseInt(detailInfo.id, 10)) {
            yield put({
              type: 'updateDetail',
              payload: response,
            });
          }
        }
      } catch (err) {
        return err;
      }
    },
    * sendPackages({ payload }, { call, put, select }) {
      try {
        const response = yield call(sendReimbursementPackages, payload);
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
    * withdraw({ payload, onSuccess }, { call, put, select }) {
      const response = yield call(withdrawReimbuserment, payload);
      if (response) {
        const processingList = yield select(state => state.reimbursement.processingList);
        processingList.push(response);
        yield put({
          type: 'save',
          payload: {
            store: 'processingList',
            data: processingList,
          },
        });
        onSuccess();
        notification.success({ message: '撤回成功' });
      }
    },
    * pay({ payload, onSuccess }, { call, put, select }) {
      try {
        const response = yield call(payReimbursements, payload);
        if (response) {
          yield put({
            type: 'afterPay',
            payload: {
              id: payload.id,
              data: response,
              onSuccess,
            },
          });
          const detailInfo = yield select(state => state.reimbursement.detailInfo);
          if (response.length === 1 && response[0].id === detailInfo.id) {
            yield put({
              type: 'updateDetail',
              payload: response[0],
            });
          }
        }
      } catch (err) {
        return err;
      }
    },
    * rejectByCashier({ payload, onSuccess }, { call, put, select }) {
      try {
        const response = yield call(rejectReimbursementByCashier, payload);
        if (response) {
          yield put({
            type: 'afterRejectByCashier',
            payload: {
              id: payload.id,
              data: response,
              onSuccess,
            },
          });
          const detailInfo = yield select(state => state.reimbursement.detailInfo);
          if (response.id === parseInt(detailInfo.id, 10)) {
            yield put({
              type: 'updateDetail',
              payload: response,
            });
          }
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
    * fetchExpenseTypes(_, { call, put }) {
      try {
        const response = yield call(fetchAllExpenseTypes);
        if (response) {
          yield put({
            type: 'save',
            payload: {
              store: 'expenseTypes',
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
      if (onSuccess) {
        onSuccess();
      }
      const newState = {
        ...state,
        processingList: state.processingList.filter(item => item.id !== id),
        overtimeList: state.overtimeList.filter(item => item.id !== id),
      };
      return newState;
    },
    afterRejectByAccountant(state, { payload }) {
      const { id, data, onSuccess } = payload;
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
      if (onSuccess) {
        onSuccess();
      }
      const newState = {
        ...state,
        processingList: state.processingList.filter(item => item.id !== id),
        overtimeList: state.overtimeList.filter(item => item.id !== id),
      };
      return newState;
    },
    afterPay(state, { payload }) {
      const { id, data, onSuccess } = payload;
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
      if (onSuccess) {
        onSuccess();
      }
      const newState = {
        ...state,
        unPaidList: state.unPaidList.filter(item => id.indexOf(item.id) === -1),
      };
      return newState;
    },
    afterRejectByCashier(state, { payload }) {
      const { id, data, onSuccess } = payload;
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
      if (onSuccess) {
        onSuccess();
      }
      const newState = {
        ...state,
        unPaidList: state.unPaidList.filter(item => item.id !== id),
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
