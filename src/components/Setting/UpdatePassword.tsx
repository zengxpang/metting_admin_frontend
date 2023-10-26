import { useNavigate } from '@@/exports';
import { Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import React from 'react';

interface IUpdatePasswordProps {}

const UpdatePassword = (props: IUpdatePasswordProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/updatePassword');
  };

  return (
    <Space onClick={handleClick}>
      <SendOutlined />
      修改密码
    </Space>
  );
};

UpdatePassword.defaultProps = {};

export default UpdatePassword;
