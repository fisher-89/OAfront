import rolesEffects from './roles';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'hroles',
  state: {
    roles: [],
  },
  effects: {
    ...rolesEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
