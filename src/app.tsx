// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { RequestConfig } from '@@/plugin-request/request';
import localforage from 'localforage';
import { Setting } from '@/components';
import to from 'await-to-js';
import { refreshToken } from '@/services';
import { history } from '@umijs/max';
import { message } from 'antd';
import { isEmpty, isNull } from 'lodash-es';

export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: false,
    menu: {
      locale: false,
    },
    layout: 'mix',
    menuHeaderRender: undefined,
    fixedHeader: true,
    rightRender: () => {
      return <Setting />;
    },
  };
};

interface PendingTask {
  config: any;
  resolve: (value: Error | PromiseLike<Error>) => void;
}
let refreshing = false; // 正在刷新token
const queue: PendingTask[] = []; // 请求队列

export const request: RequestConfig = {
  timeout: 5000,
  baseURL: '/api',
  requestInterceptors: [
    (url, options) => {
      const accessToken = localStorage.getItem('meeting-room/access_token');
      if (accessToken) {
        options.headers.authorization =
          'Bearer ' + accessToken.substring(1, accessToken.length - 1);
      }
      return { url, options };
    },
  ],
  responseInterceptors: [
    [
      (response: any) => {
        return response?.data;
      },
      async (error: any) => {
        const { data, config } = error.response;

        if (refreshing) {
          return new Promise((resolve) => {
            queue.push({ config, resolve });
          });
        }

        const refresh_token = await localforage.getItem('refresh_token');

        if (
          data.code === 401 &&
          !config.url.includes('/user/refresh') &&
          !isNull(refresh_token)
        ) {
          refreshing = true;
          const res = await refreshToken();
          if (!isEmpty(res)) {
            refreshing = false;
            //TODO  有问题不会重新发起请求
            if (!isEmpty(queue)) {
              queue.forEach(({ config, resolve }) => {
                resolve(config);
              });
            }
            return config;
          }
        } else {
          message.error(data.data);
          history.push('/login');
        }

        return Promise.reject(error.response.data);
      },
    ],
  ],
};

localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: 'meeting-room',
});
