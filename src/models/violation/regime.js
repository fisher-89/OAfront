import {
  regimeList,
  updateRegime,
  regimeInfo,
  addRegime,
  deleteRegime,
} from '../../services/violation';

const store = 'regime';

export default {
  * fetchRegime({ payload }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      let response;
      if (params.id) {
        response = yield call(regimeInfo, params);
      } else {
        response = yield call(regimeList, params);
      }

      yield put({
        type: 'save',
        payload: {
          store,
          id: params.id,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * addRegime({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const response = yield call(addRegime, params);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'add',
          payload: {
            store,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (err) { return err; }
  },
  * updateRegime({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload,
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(updateRegime, params, id);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: 'update',
          payload: {
            store,
            id,
            data: response,
          },
        });
        onSuccess(response);
      }
    } catch (err) { return err; }
  },
  * deleteRegime({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(deleteRegime, id);
      if (response.error) {
        notification.error({
          message: '删除失败',
          description: response.error,
        });
      } else {
        yield put({
          type: 'delete',
          payload: {
            store,
            id,
          },
        });
      }
    } catch (err) { return err; }
  },
};
