import sourceEffect from './source';
import defaultReducers from '../reducers';

export default {
  namespace: 'customer',
  state: {
    source: [],
  },
  effects: {
    ...sourceEffect,
  },
  reducers: {
    ...defaultReducers,
  },
};
