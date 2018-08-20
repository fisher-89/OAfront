import {
  notification,
} from 'antd';
import eventEffects from './event/event';
import typeEffects from './event/type';
import eventLogEffects from './eventLog';
import authEffects from './auth';
import taskAuthEffects from './taskAuth';
import finalEffects from './final';
import baseEffects from './base';
import logEffects from './log';
import commadnEffects from './commadn';
import certificateEffects from './certificate';
import targetsEffects from './targets';

import indexReducers from '../reducers';
import targetsReducers from './targets/reducers';

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
    taskAuth: [],
    commadnLog: {},
    targets: [],
    targetsDetails: {},
  },
  effects: {
    ...eventEffects,
    ...typeEffects,
    ...eventLogEffects,
    ...authEffects,
    ...taskAuthEffects,
    ...finalEffects,
    ...baseEffects,
    ...logEffects,
    ...commadnEffects,
    ...certificateEffects,
    ...targetsEffects,
  },
  reducers: {
    ...indexReducers,
    ...targetsReducers,
    updateTaskAuth(state, action) {
      const { store, data } = action.payload;
      const adminSn = action.payload.admin_sn;
      if (data.message) {
        notification.error({
          message: data.message,
        });
        return;
      }
      notification.success({
        message: '编辑成功',
      });
      const dataSource = Array.isArray(state[store]) ? state[store] : state[store].data;
      let updated = false;
      const newStore = dataSource.map((item) => {
        if (parseInt(item.admin_sn, 0) === parseInt(adminSn, 0)) {
          updated = true;
          return data;
        } else {
          return item;
        }
      });
      if (!updated) {
        newStore.push(data);
      }
      return {
        ...state,
        [store]: newStore,
      };
    },
    deleteTaskStaffAuth(state, action) {
      const { store, id } = action.payload;
      notification.success({
        message: '删除成功',
      });

      const dataState = state[store].filter(item => item.admin_sn !== id);
      return {
        ...state,
        [store]: dataState,
      };
    },
    deleteCertificateAndStaff(state, action) {
      const { store, id } = action.payload;
      notification.success({
        message: '删除成功',
      });
      const dataState = Array.isArray(state[store]) ? (
        state[store] ? state[store].filter(item => item.id !== id) : []
      ) :
        (
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
