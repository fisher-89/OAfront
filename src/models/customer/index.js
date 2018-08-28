import sourceEffect from './source';
import clientEffect from './client';
import tagsTypeEffect from './tagsType';
import tagsEffect from './tags';
import defaultReducers from '../reducers';

export default {
  namespace: 'customer',
  state: {
    tags: [],
    source: [],
    customer: {},
    tagsType: [],
    customerDetails: {},
  },
  effects: {
    ...tagsEffect,
    ...sourceEffect,
    ...clientEffect,
    ...tagsTypeEffect,
  },
  reducers: {
    ...defaultReducers,
  },
};
