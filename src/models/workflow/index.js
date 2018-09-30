import validatorEffects from './validator';
import variateEffects from './variate';
import formEffects from './form';
import formTypeEffects from './formType';
import flowEffects from './flow';
import flowTypeEffects from './flowType';
import apiConfigEffects from './apiConfig';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'workflow',
  state: {
    flow: [],
    flowType: [],
    flowDetails: {},
    form: [],
    formDetails: {},
    formType: [],
    formTypeDetails: [],
    validator: [],
    validatorDetails: {},
    variate: {},
    apiConfig: [],
  },
  effects: {
    ...formEffects,
    ...formTypeEffects,
    ...validatorEffects,
    ...flowEffects,
    ...variateEffects,
    ...flowTypeEffects,
    ...apiConfigEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};

