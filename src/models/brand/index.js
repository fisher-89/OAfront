import brandEffects from './brand';
import brandEffectsAll from './all';
import defaultReducers from '../reducers';

export default {
  namespace: 'brand',
  state: {
    all: [],
    brand: [],
    details: {},
  },
  effects: {
    ...brandEffects,
    ...brandEffectsAll,
  },
  reducers: {
    ...defaultReducers,
  },
};
