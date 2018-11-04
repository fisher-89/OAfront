import { notification } from 'antd';
import validatorEffects from './validator';
import variateEffects from './variate';
import formEffects from './form';
import formTypeEffects from './formType';
import flowEffects from './flow';
import flowTypeEffects from './flowType';
import apiConfigEffects from './apiConfig';
import approverModeEffects from './approverMode';
import approverEffects from './approver';
import messageEffects from './message';
import defaultReducers from '../reducers';


export default {
  namespace: 'workflow',
  state: {
    flow: [],
    flowType: [],
    flowDetails: {},
    form: [],
    formDetails: {},
    formType: [],
    formTypeDetails: [],
    validator: [],
    validatorDetails: {},
    variate: {},
    apiConfig: [],
    apiConfigDetails: {},
    approver: [],
    stepDepartment: {},
    flowRunLog: {},
    waitMsg: {},
    workMsg: {},
  },
  effects: {
    ...formEffects,
    ...formTypeEffects,
    ...validatorEffects,
    ...flowEffects,
    ...variateEffects,
    ...flowTypeEffects,
    ...apiConfigEffects,
    ...approverModeEffects,
    ...approverEffects,
    ...messageEffects,
  },
  reducers: {
    ...defaultReducers,
    saveStepDepartmentData(state, action) {
      const { id, store, data } = action.payload;
      return {
        ...state,
        [store]: {
          ...state[store],
          [id]: data,
        },
      };
    },
    addStepDepartmentData(state, action) {
      const { id, store, data } = action.payload;
      notification.success({ message: '添加成功' });
      const newData = state[store][id] || [];
      newData.push(data);
      return {
        ...state,
        [store]: {
          ...state[store],
          [id]: newData,
        },
      };
    },
    updateStepDepartmentData(state, action) {
      const { id, store, modeId, data } = action.payload;
      notification.success({ message: '编辑成功' });
      let newData = state[store][modeId] || [];
      let updated = false;
      newData = newData.map((item) => {
        if (parseInt(item.id, 0) === parseInt(id, 0)) {
          updated = true;
          return data;
        } else {
          return item;
        }
      });
      if (!updated) {
        newData.push(data);
      }
      return {
        ...state,
        [store]: {
          ...state[store],
          [modeId]: newData,
        },
      };
    },
    deleteStepDepartmentData(state, action) {
      const { id, modeId, store } = action.payload;
      notification.success({ message: '删除成功' });
      const newData = state[store][modeId] || [];
      return {
        ...state,
        [store]: {
          ...state[store],
          [modeId]: newData.filter(item => item.id !== id),
        },
      };
    },
  },
};

