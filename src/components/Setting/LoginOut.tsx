import { Space } from 'antd';
import React from 'react';
import { LoginOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import localforage from 'localforage';

interface LoginOutProps {}

const LoginOut = (props: LoginOutProps) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    await localforage.removeItem('access_token');
    await localforage.removeItem('refresh_token');
    await localforage.removeItem('user_info');
    navigate('/login');
  };

  return (
    <Space onClick={handleClick}>
      <LoginOutlined />
      退出登录
    </Space>
  );
};

export default LoginOut;
