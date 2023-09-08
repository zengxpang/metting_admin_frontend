import { request } from '@umijs/max';
import localforage from 'localforage';

export const refreshToken = async () => {
  return request('/user/admin/refresh', {
    method: 'GET',
    params: {
      refreshToken: await localforage.getItem('refresh_token'),
    },
  });
};
