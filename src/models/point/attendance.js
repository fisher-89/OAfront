import { editAttendance, fetchAttendance } from "../../services/point";

const store = "attendance";

export default {
  *fetchAttendance({ payload }, { call, put }) {
    try {
      const params = payload;
      const response = yield call(fetchAttendance, params);
      yield put({
        type: "save",
        payload: {
          store,
          data: response
        }
      });
    } catch (err) {
      return err;
    }
  },
  *editAttendance({ payload, onSuccess, onError }, { call, put }) {
    try {
      const params = {
        ...payload
      };
      const { id } = payload;
      delete params.id;
      const response = yield call(editAttendance, params, id);
      if (response.errors && onError) {
        onError(response.errors);
      } else {
        yield put({
          type: "update",
          payload: {
            store,
            id,
            data: response
          }
        });
        onSuccess(response);
      }
    } catch (err) {
      return err;
    }
  }
};
