import fineEffects from './fine';
import regimeEffects from './regime';
import countEffects from './count';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'violation',
  state: {
    fine: [],
    regime: [],
    count: [],
  },
  effects: {
    ...fineEffects,
    ...regimeEffects,
    ...countEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
