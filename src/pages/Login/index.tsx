import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, request } from '@umijs/max';
import to from 'await-to-js';
import { isNull } from 'lodash-es';
import { Image, message, Tabs } from 'antd';
import localforage from 'localforage';
import { useNavigate } from '@umijs/max';
import { useState } from 'react';

import { QRCODE_STATUS_MAP_TITLE } from './constants';

// no-scan 未扫描
// scan-wait-confirm -已扫描，等待用户确认
// scan-confirm 已扫描，用户同意授权
// scan-cancel 已扫描，用户取消授权
// expired 已过期

type ILoginType = 'account' | 'scan';
type IQrcodeStatus =
  | 'no-scan'
  | 'scan-wait-confirm'
  | 'scan-confirm'
  | 'scan-cancel'
  | 'expired';

interface ILoginProps {}

const Login = (props: ILoginProps) => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<ILoginType>('account');
  const [qrcodeInfo, setQrcodeInfo] = useState<IKeyValue>({});
  const [qrcodeStatus, setQrcodeStatus] = useState<IQrcodeStatus>('no-scan');

  const generateQrcode = async () => {
    const [err, res] = await to(request('/qrcode/generate'));
    if (isNull(err)) {
      setQrcodeInfo(res);
    }
  };

  const checkQrcode = async () => {
    const [err, res] = await to(request('/qrcode/check'));
    if (isNull(err)) {
      console.log(res);
    }
  };

  const handleFinish = async (values: {
    username: string;
    password: string;
  }) => {
    const [err, res] = await to(
      request('/user/admin/login', {
        method: 'post',
        data: values,
      }),
    );
    if (isNull(err)) {
      await localforage.setItem('access_token', res.accessToken);
      await localforage.setItem('refresh_token', res.refreshToken);
      await localforage.setItem('user_info', res.userInfo);
      message.success('登录成功');
      navigate('/');
    } else {
      message.error(err.data || err);
    }
  };

  const handleLoginTypeChange = async (key: string) => {
    if (key === 'scan') {
      await generateQrcode();
    }
    setLoginType(key as ILoginType);
  };

  return (
    <LoginForm
      title="会议室预定系统管理端"
      subTitle="zxp"
      onFinish={handleFinish}
      initialValues={{
        username: 'zhangsan',
        password: '123456',
      }}
    >
      <Tabs centered activeKey={loginType} onChange={handleLoginTypeChange}>
        <Tabs.TabPane tab="账户密码登录" key="account" />
        <Tabs.TabPane tab="扫码登录" key="scan" />
      </Tabs>
      {loginType === 'account' && (
        <>
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'请输入用户名'}
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'请输入密码'}
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          />
        </>
      )}
      {loginType === 'scan' && (
        <div className={'justify-center items-center flex flex-col'}>
          <Image src={qrcodeInfo?.image} height={138} width={138} />
          <h3>{QRCODE_STATUS_MAP_TITLE[qrcodeStatus]}</h3>
        </div>
      )}
      <div className="flex justify-between mb-8px ">
        <Link to="/register">注册账号</Link>
        <Link to="/updatePassword">忘记密码</Link>
      </div>
    </LoginForm>
  );
};

export default Login;
