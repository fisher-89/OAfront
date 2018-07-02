import rolesEffects from './roles';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'roles',
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
