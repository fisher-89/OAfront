import authEffects from './auth';
import defaultReducers from '../reducers';

export default {
  namespace: 'authority',
  state: {
    auth: [],
  },
  effects: {
    ...authEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
