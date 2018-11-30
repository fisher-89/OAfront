import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

const errorCode = [400, 401, 422];

function checkStatus(response) {
  const { status, url, statusText } = response;

  if ((status >= 200 && status < 300) || errorCode.indexOf(status) !== -1) {
    return response;
  }
  const errortext = codeMessage[status] || statusText;
  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = status;
  error.response = response;
  throw error;
}

function notificateErrorMessage(promise, response) {
  promise.then((body) => {
    if (body.message) {
      notification.error({
        message: body.message,
        description: `请求错误 ${response.status}: ${response.url}`,
      });
    } else {
      notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
      });
    }
  });
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  let urlParam = url;
  const defaultOptions = {
    credentials: 'same-origin',
  };

  const newOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options && options.headers),
    },
  };
  const accessToken = localStorage.getItem(`${TOKEN_PREFIX}access_token`);
  const expiresIn = localStorage.getItem(`${TOKEN_PREFIX}access_token_expires_in`);

  if (url.match(/\/api\//)) {
    if (accessToken && expiresIn > new Date().getTime()) {
      newOptions.headers = {
        Authorization: `Bearer ${localStorage.getItem(`${TOKEN_PREFIX}access_token`)}`,
        ...newOptions.headers,
      };
    } else {
      store.dispatch(routerRedux.push('/passport/redirect_to_authorize'));
    }
  }

  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'PATCH') {
    newOptions.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  } else if (newOptions.method === 'GET' && newOptions.body) {
    const paramsArray = [];
    Object.keys(newOptions.body).forEach((key) => {
      let param = newOptions.body[key];
      if (typeof param === 'object') {
        param = JSON.stringify(param);
      }
      paramsArray.push(`${key}=${param}`);
    });
    delete newOptions.body;
    if (url.search(/\?/) === -1 && paramsArray.length > 0) {
      urlParam += `?${paramsArray.join('&')}`;
    } else if (paramsArray.length > 0) {
      urlParam += `&${paramsArray.join('&')}`;
    }
  }


  const result = fetch(urlParam, newOptions)
    .then(checkStatus)
    .then((response) => {
      const cntType = response.headers.get('content-type');
      if (
        cntType === 'application/vnd.ms-excel; charset=UTF-8'
        ||
        cntType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8'
        ||
        cntType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        return response;
      }

      if (cntType.indexOf('application/json') === -1 || response.status === 204) {
        return response.text();
      } else {
        const promise = response.json();
        if (response.status === 400 || (newOptions.method === 'GET' && response.status === 401)) {
          notificateErrorMessage(promise, response);
        }
        return promise;
      }
    });
  return result;
}
