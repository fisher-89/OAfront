import brandEffects from './brand';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'brand',
  state: {
    brand: [],
    details: {},
  },
  effects: {
    ...brandEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
