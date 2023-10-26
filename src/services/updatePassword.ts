import { request } from '@umijs/max';

export const updatePasswordCaptcha = (address: string) => {
  return request('/user/update_password/captcha', {
    method: 'GET',
    params: {
      address,
    },
  });
};

export interface IUpdatePassword {
  captcha: string;
  username: string;
  password: string;
  email: string;
}

export const updatePassword = (data: IUpdatePassword) => {
  return request('/user/admin/update_password', {
    method: 'POST',
    data,
  });
};
