import positionEffects from './position';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'position',
  state: {
    position: [],
    details: {},
  },
  effects: {
    ...positionEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
