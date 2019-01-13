import fineLogEffects from './fineLog';
import ruleEffects from './rule';
import ruleTypeEffects from './rule-type';
import scoreEffects from './score';
import moneyEffects from './money';
import staffViolationEffects from './staffviolation';
import departmentViolationEffects from './departmentviolation';
import mathEffects from './math';
import defaultReducers from '../reducers/violation';

export default {
  namespace: 'violation',
  state: {
    departmentviolation: [],
    finelog: [],
    rule: [],
    ruletype: [],
    money: {},
    math: [],
    score: {},
    staffviolation: [],
  },
  effects: {
    ...fineLogEffects,
    ...ruleEffects,
    ...ruleTypeEffects,
    ...moneyEffects,
    ...mathEffects,
    ...scoreEffects,
    ...staffViolationEffects,
    ...departmentViolationEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};

