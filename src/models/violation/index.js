import { notification } from 'antd';
import fineLogEffects from './fineLog';
import ruleEffects from './rule';
import ruleTypeEffects from './rule-type';
import scoreEffects from './score';
import moneyEffects from './money';
import staffViolationEffects from './staffviolation';
import mathEffects from './math';
import pushAuthEffects from './pushAuth';
import pushGroupEffects from './pushgroup';
import defaultReducers from '../reducers';


export default {
  namespace: 'violation',
  state: {
    finelog: [],
    rule: [],
    ruletype: [],
    money: {},
    math: [],
    score: {},
    staffviolation: [],
    pushauth: [],
    pushgroup: [],
  },
  effects: {
    ...fineLogEffects,
    ...ruleEffects,
    ...ruleTypeEffects,
    ...moneyEffects,
    ...mathEffects,
    ...pushAuthEffects,
    ...pushGroupEffects,
    ...scoreEffects,
    ...staffViolationEffects,
  },
  reducers: {
    ...defaultReducers,

    pushlog(state, action) {
      const { data, message } = action.payload;
      if (data.message) {
        return state;
      }
      notification.success({
        message: message || '推送成功',
      });
      return {
        ...state,
      };
    },

    groupupdate(state, action) {
      const { store, data } = action.payload;
      let group = state[store];
      group = group.map((item) => {
        return {
          ...item,
          default_push: null,
        };
      });
      data.forEach((item) => {
        group = group.filter(key => key.id !== item.id);
        group.push(item);
      });
      return {
        ...state,
        [`${store}`]: group,
      };
    },

    pay(state, action) {
      const { store, id, data, message } = action.payload;
      if (data.message) {
        notification.error({
          message: data.message,
        });
        return { ...state };
      }
      notification.success({
        message: message || '支付成功',
      });
      const originalStore = { ...state[`${store}Details`] };
      Object.keys(originalStore).forEach((key) => {
        if (`${id}` === `${key}`) {
          originalStore[key] = data;
        }
      });

      const dataSource = Array.isArray(state[store]) ? state[store] : (state[store].data || []);
      let updated = false;
      const newStore = dataSource.map((item) => {
        if (parseInt(item.id, 0) === parseInt(id, 0)) {
          updated = true;
          return data;
        } else {
          return item;
        }
      });
      if (!updated) {
        newStore.push(data);
      }
      let dataState;
      if (Array.isArray(state[store])) {
        dataState = state[store] ? [...newStore] : [];
      } else {
        dataState = state[store].data ? {
          ...state[store],
          data: newStore,
        } : {};
      }
      return {
        ...state,
        [store]: dataState,
        [`${store}Details`]: originalStore,
      };
    },

    payback(state, action) {
      const { store, id, data, message } = action.payload;
      if (data.message) {
        notification.error({
          message: data.message,
        });
        return { ...state };
      }
      notification.success({
        message: message || '退款成功',
      });
      const originalStore = { ...state[`${store}Details`] };
      Object.keys(originalStore).forEach((key) => {
        if (`${id}` === `${key}`) {
          originalStore[key] = data;
        }
      });
      const dataSource = Array.isArray(state[store]) ? state[store] : (state[store].data || []);
      let updated = false;
      const newStore = dataSource.map((item) => {
        if (parseInt(item.id, 0) === parseInt(id, 0)) {
          updated = true;
          return data;
        } else {
          return item;
        }
      });
      if (!updated) {
        newStore.push(data);
      }
      let dataState;
      if (Array.isArray(state[store])) {
        dataState = state[store] ? [...newStore] : [];
      } else {
        dataState = state[store].data ? {
          ...state[store],
          data: newStore,
        } : {};
      }
      return {
        ...state,
        [store]: dataState,
        [`${store}Details`]: originalStore,
      };
    },

    statisticsfetch(state, action) {
      const { store, params, data } = action.payload;
      if (params.staff_sn) {
        if (params.department_id === 'all') {
          if (data.length <= 0) {
            return {
              ...state,
              [store]: {
                ...state[store],
                [`${params.department_id}`]: {
                  ...{ ...state[store] }[`${params.department_id}`],
                  [`${params.month}`]: {
                    ...{ ...state[store] }[`${params.department_id}`][`${params.month}`],
                  },
                },
              },
            };
          } else {
            const [midkey] = data;
            const midmidkey = { ...{ ...state[store] }[`${params.department_id}`][`${params.month}`] }.data;
            let update = false;
            const newdata = (midmidkey || []).map((item) => {
              if (item.staff_sn.toString() === params.staff_sn) {
                update = true;
                return midkey;
              } else {
                return item;
              }
            });
            if (!update) {
              newdata.push(midkey);
            }
            return {
              ...state,
              [store]: {
                ...state[store],
                [`${params.department_id}`]: {
                  ...{ ...state[store] }[`${params.department_id}`],
                  [`${params.month}`]: {
                    ...{ ...state[store] }[`${params.department_id}`][`${params.month}`],
                    data: newdata,
                  },
                },
              },
            };
          }
        } else if (data.length <= 0) {
          return {
            ...state,
            [store]: {
              ...state[store],
              [`${params.department_id}`]: {
                ...{ ...state[store] }[`${params.department_id}`],
                [`${params.month}`]:
                  { ...state[store] }[`${params.department_id}`][`${params.month}`],
              },
            },
          };
        } else {
          const [midkey] = data;
          const midmidkey = { ...state[store] }[`${params.department_id}`][`${params.month}`];
          let update = false;
          const newdata = (midmidkey || []).map((item) => {
            if (item.staff_sn.toString() === params.staff_sn) {
              update = true;
              return midkey;
            } else {
              return item;
            }
          });
          if (!update) {
            newdata.push(midkey);
          }
          return {
            ...state,
            [store]: {
              ...state[store],
              [`${params.department_id}`]: {
                ...{ ...state[store] }[`${params.department_id}`],
                [`${params.month}`]: newdata,
              },
            },
          };
        }
      } else if (params.department_id === 'all') {
        return {
          ...state,
          [store]: {
            ...state[store],
            [`${params.department_id}`]: {
              ...{ ...state[store] }[`${params.department_id}`],
              [`${params.month}`]: {
                ...data,
              },
            },
          },
        };
      } else {
        return {
          ...state,
          [store]: {
            ...state[store],
            [`${params.department_id}`]: {
              ...{ ...state[store] }[`${params.department_id}`],
              [`${params.month}`]:
                data,
            },
          },
        };
      }
    },

    paychange(state, action) {
      const { store, params, data, message } = action.payload;
      let newdata = state[store];
      if (data.message) {
        notification.error({
          message: data.message,
        });
        return { ...state };
      }
      notification.success({
        message: message || '编辑成功',
      });
      const allkeys = Object.keys(newdata);
      // allkeys是部门 months是月份 whole是全部数据 item是数据编号 ixs是单个部门 ms是单个月份
      params.forEach((item) => {
        allkeys.forEach((ixs) => {
          const months = Object.keys(newdata[ixs]);
          let monthdata = {};
          months.forEach((ms) => {
            if (ixs === 'all') {
              const midkey = newdata[ixs][ms].data.map((sin) => {
                if (sin.id === item) {
                  const [mid] = data.filter(zss => zss.id === item);
                  return mid;
                } else {
                  return sin;
                }
              });
              monthdata = {
                ...monthdata,
                [`${ms}`]: {
                  ...state[store].all[`${ms}`],
                  data: midkey,
                },
              };
            } else {
              const midkey = newdata[ixs][ms].map((sin) => {
                if (sin.id === item) {
                  const [mid] = data.filter(zss => zss.id === item);
                  return mid;
                } else {
                  return sin;
                }
              });
              monthdata = {
                ...monthdata,
                [`${ms}`]: midkey,
              };
            }
          });
          newdata = {
            ...newdata,
            [`${ixs}`]: {
              ...monthdata,
            },
          };
        });
      });
      return {
        ...state,
        [store]: {
          ...newdata,
        },
      };
    },

    singleStaffMultiPay(state, action) {
      const { store, payload, data, message } = action.payload;
      let newdata = state[store];
      if (data.message) {
        notification.error({
          message: data.message,
        });
        return { ...state };
      }
      notification.success({
        message: message || '编辑成功',
      });
      const allkeys = Object.keys(newdata);
      // allkeys是部门 months是月份 whole是全部数据 item是数据编号 ixs是单个部门 ms是单个月份 ssi单条信息
      payload.forEach((item) => {
        allkeys.forEach((ixs) => {
          const months = Object.keys(newdata[ixs]);
          let monthdata = {};
          months.forEach((ms) => {
            if (ixs === 'all') {
              const midkey = newdata[ixs][ms].data.map((sin) => {
                const mmkey = sin.count_has_punish.map((ssi) => {
                  if (ssi.punish_id === item) {
                    const [mid] = data.filter(zss => zss.id === item);
                    return {
                      ...ssi,
                      punish: mid,
                    };
                  } else {
                    return ssi;
                  }
                });
                let mma = 0;
                let allmoney = 0;
                mmkey.forEach((sasa) => {
                  if (sasa.punish.has_paid) {
                    allmoney += sasa.punish.money;
                  }
                });
                if (allmoney === sin.money) {
                  mma = 1;
                }
                return {
                  ...sin,
                  count_has_punish: mmkey,
                  has_settle: mma,
                  paid_money: allmoney,
                };
              });
              monthdata = {
                ...monthdata,
                [`${ms}`]: {
                  ...state[store].all[`${ms}`],
                  data: midkey,
                },
              };
            } else {
              const midkey = newdata[ixs][ms].map((sin) => {
                const mmkey = sin.count_has_punish.map((ssi) => {
                  if (ssi.punish_id === item) {
                    const [mid] = data.filter(zss => zss.id === item);
                    return {
                      ...ssi,
                      punish: mid,
                    };
                  } else {
                    return ssi;
                  }
                });
                let mma = 0;
                let allmoney = 0;
                mmkey.forEach((sasa) => {
                  if (sasa.punish.has_paid) {
                    allmoney += sasa.punish.money;
                  }
                });
                if (allmoney === sin.money) {
                  mma = 1;
                }
                return {
                  ...sin,
                  count_has_punish: mmkey,
                  has_settle: mma,
                  paid_money: allmoney,
                };
              });
              monthdata = {
                ...monthdata,
                [`${ms}`]: midkey,
              };
            }
          });
          newdata = {
            ...newdata,
            [`${ixs}`]: {
              ...monthdata,
            },
          };
        });
      });
      return {
        ...state,
        [store]: {
          ...newdata,
        },
      };
    },
  },
};

