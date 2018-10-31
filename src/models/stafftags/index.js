import defaultReducers from '../reducers';
import staffTagsEffects from './stafftags';
import staffTagTypesEffects from './stafftagtypes';

export default {
  namespace: 'stafftags',
  state: {
    stafftags: [],
    stafftagtypes: [],
  },
  effects: {
    ...staffTagsEffects,
    ...staffTagTypesEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};

