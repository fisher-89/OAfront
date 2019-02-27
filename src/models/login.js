import { loginByTelephone, clearlogin } from '../services/user';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    * login({ payload }, { call, put }) {
      const response = yield call(loginByTelephone, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        // 非常粗暴的跳转,登陆成功之后权限会变成user或admin,会自动重定向到主页
        // Login success after permission changes to admin or user
        // The refresh will automatically redirect to the home page
        // yield put(routerRedux.push('/'));
        window.location.reload();
      }
    },
    * logout(_, { call, put }) {
      yield call(clearlogin);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: [],
        },
      });

      localStorage.clear();
      // yield put(routerRedux.push('/user/login'));
      // Login out after permission changes to admin or user
      // The refresh will automatically redirect to the login page
      const redirectPath = encodeURIComponent(`${OA_PATH}oauth/authorize?client_id=${OA_CLIENT_ID}&response_type=code`);
      window.location.href = `${OA_PATH}logout?url=${redirectPath}`;
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
