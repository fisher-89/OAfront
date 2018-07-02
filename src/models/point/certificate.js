
import { notification } from 'antd';
import {
  fetchCertificate,
  addCertificate,
  editCertificate,
  deleteCertificate,
  addCertificateAward,
  fetchCertificateStaff,
  deleteCertificateStaff,
} from '../../services/point';

const store = 'certificate';

export default {
  * fetchCertificate({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const { id } = params;
      delete params.id;
      const response = yield call(fetchCertificate, params, id || '');
      if (!response) return;
      yield put({
        type: 'save',
        payload: {
          store,
          id,
          data: response,
        },
      });
    } catch (err) {
      return err;
    }
  },
  * addCertificate({ payload, onSuccess, onError }, { call, put }) {
    const params = {
      ...payload,
    };
    try {
      const response = yield call(addCertificate, params);
      if ((response.errors && onError) || response.message) {
        const { message } = response;
        onError(response.errors || {}, message || null);
        return;
      }
      yield put({
        type: 'add',
        payload: {
          store,
          data: response,
        },
      });
      onSuccess(response);
    } catch (err) {
      return err;
    }
  },
  * editCertificate({ payload, onSuccess, onError }, { call, put }) {
    const params = {
      ...payload,
    };
    const { id } = payload;
    delete params.id;
    try {
      const response = yield call(editCertificate, params, id);
      if (!response) return;
      if ((response.errors && onError) || response.message) {
        const { message } = response;
        onError(response.errors || {}, message || null);
        return;
      }
      yield put({
        type: 'update',
        payload: {
          store,
          id,
          data: response,
        },
      });
      onSuccess(response);
    } catch (err) {
      return err;
    }
  },
  * deleteCertificate({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteCertificate, id);
      if (response.error) {
        notification.error({
          message: '删除失败',
          description: response.error,
        });
        return;
      }
      yield put({
        type: 'deleteCertificateAndStaff',
        payload: {
          store,
          id,
        },
      });
    } catch (err) {
      return err;
    }
  },
  * fetchCertificateStaff({ payload }, { call, put }) {
    try {
      const response = yield call(fetchCertificateStaff, payload);
      yield put({
        type: 'save',
        payload: {
          store: 'certificateStaff',
          data: response,
        },
      });
    } catch (err) {
      return err;
    }
  },
  * addCertificateAward({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addCertificateAward, params);
      if (response.errors && onError) {
        onError(response.errors || {});
        return;
      }
      yield put({
        type: 'addCertificateStaff',
        payload: {
          store: 'certificateStaff',
          data: response,
        },
      });
      onSuccess(response);
    } catch (err) {
      return err;
    }
  },
  * deleteCertificateStaff({ payload }, { call, put }) {
    try {
      const response = yield call(deleteCertificateStaff, payload);
      if (response && response.errors && onError) {
        notification.error({
          message: '删除失败',
          description: JSON.stringify(response.errors),
        });
        return;
      }
      yield put({
        type: 'delteCertificateStaff',
        payload: {
          store: 'certificateStaff',
          ids: payload.keys,
        },
      });
    } catch (err) {
      return err;
    }
  },
};
