import departmentTreeEffects from './tree';
import departmentEffects from './department';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'department',
  state: {
    tree: [],
    department: [],
  },
  effects: {
    ...departmentEffects,
    ...departmentTreeEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
