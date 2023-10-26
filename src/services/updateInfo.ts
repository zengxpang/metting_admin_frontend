import { request } from '@umijs/max';

export const getUserInfo = () => {
  return request('/user/info');
};

export interface IUpdateUserInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}
export const updateUserInfo = (data: IUpdateUserInfo) => {
  return request('/user/admin/update', {
    method: 'POST',
    data,
  });
};

export const updateUserInfoCaptcha = () => {
  return request('/user/update/captcha');
};
