import positionEffects from './position';
import positionEffectsAll from './all';
import defaultReducers from '../reducers';

export default {
  namespace: 'position',
  state: {
    all: [],
    position: [],
    details: {},
  },
  effects: {
    ...positionEffects,
    ...positionEffectsAll,
  },
  reducers: {
    ...defaultReducers,
  },
};
