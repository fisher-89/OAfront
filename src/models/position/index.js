import positionEffects from './position';
import defaultReducers from '../reducers';

export default {
  namespace: 'position',
  state: {
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
