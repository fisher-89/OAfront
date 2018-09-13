import authEffects from './auth';
import defaultReducers from '../reducers';

export default {
  namespace: 'authority',
  state: {
    authority: [],
  },
  effects: {
    ...authEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
