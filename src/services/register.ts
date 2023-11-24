import { request } from '@umijs/max';

export const registerCaptcha = (address: string) =>
  request('/user/register-captcha', {
    method: 'GET',
    params: {
      address,
    },
  });

export interface IRegisterUser {
  captcha: string;
  email: string;
  nickName: string;
  password: string;
  username: string;
  isAdmin: boolean;
  phoneNumber?: string;
  headPic?: string;
}

export const register = (data: IRegisterUser) => {
  return request('/user/register', {
    method: 'POST',
    data,
  });
};
