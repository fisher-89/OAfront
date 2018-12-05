import shopEffects from './shop';
import defaultReducers from '../reducers/shop';

export default {
  namespace: 'shop',
  state: {
    shop: [],
    total: 0,
    filtered: 0,
    details: {},
  },
  effects: {
    ...shopEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
