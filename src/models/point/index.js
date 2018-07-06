import {
  notification,
} from 'antd';
import eventEffects from './event/event';
import typeEffects from './event/type';
import authEffects from './auth';
import taskAuthEffects from './taskAuth';
import finalEffects from './final';
import baseEffects from './base';
import logEffects from './log';
import certificateEffects from './certificate';

import indexReducers from '../reducers';

export default {
  namespace: 'point',
  state: {
    event: {},
    auth: {},
    final: {},
    education: [],
    position: [],
    type: [],
    pointLog: {},
    certificate: [],
    certificateStaff: [],
    taskAuth: {},
  },
  effects: {
    ...eventEffects,
    ...typeEffects,
    ...authEffects,
    ...taskAuthEffects,
    ...finalEffects,
    ...baseEffects,
    ...logEffects,
    ...certificateEffects,
  },
  reducers: {
    ...indexReducers,
    deleteCertificateAndStaff(state, action) {
      const { store, id } = action.payload;
      notification.success({
        message: '删除成功',
      });
      const dataState = Array.isArray(state[store]) ? (
        state[store] ? state[store].filter(item => item.id !== id) : []
      ) : (
        state[store].data ? {
          ...state[store],
          total: state[store].total - 1,
          data: state[store].data.filter(item => item.id !== id),
        } : {}
      );
      const certificateStaff = state.certificateStaff.filter(item => item.certificate_id !== id);

      return {
        ...state,
        certificateStaff,
        [store]: dataState,
      };
    },
    addCertificateStaff(state, action) {
      const { store, data } = action.payload;
      const ids = state[store].map((item) => {
        return `${item.certificate_id}-${item.staff_sn}`;
      });

      const dataState = data.filter((item) => {
        return ids.indexOf(`${item.certificate_id}-${item.staff_sn}`) === -1;
      });
      if (dataState.length) {
        notification.success({
          message: '添加成功',
        });
      }
      return {
        ...state,
        [store]: state[store].length ? state[store].concat(dataState) : [],
      };
    },
    delteCertificateStaff(state, action) {
      const { store, ids } = action.payload;
      notification.success({
        message: '删除成功',
      });

      const dataState = state[store].filter((item) => {
        return ids.indexOf(`${item.certificate_id}-${item.staff_sn}`) === -1;
      });

      return {
        ...state,
        [store]: state[store].length ? dataState : [],
      };
    },
  },
};
