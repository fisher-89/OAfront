import fineLogEffects from './fineLog';
import ruleEffects from './rule';
import ruleTypeEffects from './rule-type';
import scoreEffects from './score';
import moneyEffects from './money';
import staffViolationEffects from './staffviolation';
import departmentViolationEffects from './departmentviolation';
import defaultReducers from '../reducers';

export default {
  namespace: 'violation',
  state: {
    finelog: [],
    rule: [],
    ruletype: [],
    money: {},
    score: {},
    staffviolation: [],
    departmentviolation: [],
  },
  effects: {
    ...fineLogEffects,
    ...ruleEffects,
    ...ruleTypeEffects,
    ...moneyEffects,
    ...scoreEffects,
    ...staffViolationEffects,
    ...departmentViolationEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};

