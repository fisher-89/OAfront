import { notification } from 'antd';
import {
  fetchBase,
  fetchEducation,
  editBase,
  editBaseForm,
} from '../../services/point';

import {
  fetchPosition,
} from '../../services/position';

const store = 'base';

export default {
  * fetchBase({ payload }, { call, put }) {
    try {
      const params = payload;
      const response = yield call(fetchBase, params);
      yield put({
        type: 'save',
        payload: {
          store: `${store}_${params.name}`,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * fetchEducation({ callBack }, { call, put }) {
    try {
      const response = yield call(fetchEducation);
      yield put({
        type: 'save',
        payload: {
          store: 'education',
          data: response,
        },
      });
      callBack();
    } catch (err) { return err; }
  },
  * fetchPosition({ callBack }, { call, put }) {
    try {
      const response = yield call(fetchPosition);
      yield put({
        type: 'save',
        payload: {
          store: 'position',
          data: response,
        },
      });
      callBack();
    } catch (err) { return err; }
  },
  * editBase({ payload, onError, onSuccess }, { call }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(editBase, params);
      if (response.errors && onError) {
        onError(response.errors);
        return;
      }
      onSuccess();
    } catch (err) { return err; }
  },
  * editBaseForm({ payload, onError }, { call }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(editBaseForm, params);
      if (response.errors && onError) {
        onError(response.errors);
        return;
      }
      notification.success({
        message: '修改成功！',
      });
    } catch (err) { return err; }
  },
};
