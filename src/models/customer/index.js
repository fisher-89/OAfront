import sourceEffect from './source';
import clientEffect from './client';
import clientLogEffect from './clientLog';
import tagsTypeEffect from './tagsType';
import tagsEffect from './tags';
import noteEffect from './note';
import noteLogEffect from './noteLog';
import noteTypeEffect from './noteType';
import defaultReducers from '../reducers';

export default {
  namespace: 'customer',
  state: {
    tags: [],
    notes: {},
    source: [],
    noteLogs: {},
    customer: {},
    tagsType: [],
    noteTypes: [],
    clientLogs: {},
    customerDetails: {},
  },
  effects: {
    ...clientLogEffect,
    ...noteLogEffect,
    ...noteEffect,
    ...tagsEffect,
    ...sourceEffect,
    ...clientEffect,
    ...tagsTypeEffect,
    ...noteTypeEffect,
  },
  reducers: {
    ...defaultReducers,
  },
};
