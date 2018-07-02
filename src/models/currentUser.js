import { queryCurrent } from '../services/user';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'currentUser',
  state: {
    currentUser: {},
  },

  effects: {
    * fetchCurrent(_, { call, put }) {
      try {
        const response = yield call(queryCurrent);
        if (response) {
          yield put({
            type: 'save',
            payload: response,
          });
        }
      } catch (err) { return err; }
    },
  },

  reducers: {
    save(state, { payload }) {
      const currentUser = { ...payload };
      if (!window.user || JSON.stringify(window.user) !== JSON.stringify(currentUser)) {
        const { oa } = currentUser.authorities;
        setAuthority(JSON.stringify(oa));
        window.user = currentUser;
      }
      return {
        ...state,
        currentUser,
      };
    },
  },
};
