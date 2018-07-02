import request from '../utils/request';

export async function tableFetch(params) {
  const bodyParams = { ...params };
  delete bodyParams.url;
  return request(params.url, {
    method: 'POST',
    body: bodyParams,
  }).catch(() => {
    //
  }).then((response) => {
    return response;
  });
}
