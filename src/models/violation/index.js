import fineLogEffects from './fineLog';
import ruleEffects from './rule';
import ruleTypeEffects from './rule-type';
import scoreEffects from './score';
import moneyEffects from './money';
import defaultReducers from '../reducers';

export default {
  namespace: 'violation',
  state: {
    finelog: [],
    rule: [],
    ruletype: [],
    money: {},
    score: {},
  },
  effects: {
    ...fineLogEffects,
    ...ruleEffects,
    ...ruleTypeEffects,
    ...moneyEffects,
    ...scoreEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};

