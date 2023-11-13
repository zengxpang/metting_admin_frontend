import { request } from '@umijs/max';
import localforage from 'localforage';
import to from 'await-to-js';
import { isNull } from 'lodash-es';

export const refreshToken = async () => {
  const [err, res] = await to(
    request('/user/admin/refresh', {
      method: 'GET',
      params: {
        refreshToken: await localforage.getItem('refresh_token'),
      },
    }),
  );
  if (isNull(err)) {
    await localforage.setItem('access_token', res.access_token);
    await localforage.setItem('refresh_token', res.refresh_token);
    return res;
  }
  return null;
};
