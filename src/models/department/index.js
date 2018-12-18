import departmentEffects from './department';
import defaultReducers from '../reducers';

export default {
  namespace: 'department',
  state: {
    department: [],
    category: [],
  },
  effects: {
    ...departmentEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
