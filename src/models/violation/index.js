import fineLogEffects from './fineLog';
import ruleEffects from './rule';
import ruleTypeEffects from './rule-type';
import defaultReducers from '../reducers';

export default {
  namespace: 'violation',
  state: {
    finelog: [],
    rule: [],
    ruletype: [],
  },
  effects: {
    ...fineLogEffects,
    ...ruleEffects,
    ...ruleTypeEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};

