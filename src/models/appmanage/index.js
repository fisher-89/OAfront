import approverEffects from './approvers';
import defaultReducers from '../reducers';
import reimDepartmentEffects from './funding-brands';

export default {
  namespace: 'appmanage',
  state: {
    approver: [],
    reimdepartment: [],
  },
  effects: {
    ...approverEffects,
    ...reimDepartmentEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
