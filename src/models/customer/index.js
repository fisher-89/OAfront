import sourceEffect from './source';
import clientEffect from './client';
import clientLogEffect from './clientLog';
import tagsTypeEffect from './tagsType';
import tagsEffect from './tags';
import noteEffect from './note';
import noteLogEffect from './noteLog';
import noteTypeEffect from './noteType';
import authEffect from './auth';
import defaultReducers from '../reducers';

export default {
  namespace: 'customer',
  state: {
    auth: {},
    tags: [],
    notes: {},
    source: [],
    noteLogs: {},
    customer: {},
    tagsType: [],
    noteTypes: [],
    clientLogs: {},
    notesDetails: {},
    customerDetails: {},
    staffBrandsAuth: {},
  },
  effects: {
    ...authEffect,
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
    saveLog(state, action) {
      const { data, id, store } = action.payload;
      const newData = state[store];
      newData[id] = data;
      return {
        ...state,
        [store]: newData,
      };
    },
    deletedLog(state, action) {
      const { store, id, clientId } = action.payload;
      const newData = state[store][clientId];
      const result = newData.filter(item => item.id !== id);
      return {
        ...state,
        [store]: {
          ...state[store],
          [clientId]: result,
        },
      };
    },
  },
};
