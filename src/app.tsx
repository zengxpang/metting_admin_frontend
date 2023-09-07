// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { RequestConfig } from '@@/plugin-request/request';
import localforage from 'localforage';
import { Setting } from '@/components';

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

export const request: RequestConfig = {
  timeout: 5000,
  baseURL: '/api',
  requestInterceptors: [
    (url, options) => {
      return { url, options };
    },
  ],
  responseInterceptors: [
    [
      (response: any) => {
        return response?.data;
      },
      (error: any) => {
        return Promise.reject(error.response.data);
      },
    ],
  ],
};

localforage.config({
  driver: localforage.LOCALSTORAGE,
  name: 'meeting-room',
});
