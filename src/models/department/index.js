import departmentEffects from './department';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'department',
  state: {
    department: [],
  },
  effects: {
    ...departmentEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
