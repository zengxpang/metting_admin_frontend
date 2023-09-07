import { Space } from 'antd';
import React from 'react';
import { LoginOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';

interface LoginOutProps {}

const LoginOut = (props: LoginOutProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // localStorage.removeItem('Auth-Token');
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
