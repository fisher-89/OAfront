import defaultReducers from '../reducers';
import expenseEffects from './expense';

export default {
  namespace: 'expense',
  state: {
    expense: [],
  },
  effects: {
    ...expenseEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
