import {
  LoginForm,
  ProFormText,
  LoginFormProps,
} from '@ant-design/pro-components';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, request, styled } from '@umijs/max';
import to from 'await-to-js';
import { isEmpty, isNull } from 'lodash-es';
import { Image, message, Tabs, TabsProps } from 'antd';
import localforage from 'localforage';
import { useNavigate } from '@umijs/max';
import { useState } from 'react';
import { useAsyncEffect, useRafInterval, useUnmount } from 'ahooks';

import { QRCODE_STATUS_MAP_TITLE } from './constants';

// background-image: url('${bg}');
// background-repeat: no-repeat;
// background-size: cover;
// background-attachment: fixed;
const Wrap = styled.div`
  height: 100%;
  .ant-pro-form-login-container {
    justify-content: center;
  }
`;

const ScanWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const FooterWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

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
interface IQrcodeInfo {
  image: string;
  qrcodeId: string;
}

interface ILoginProps {}

const Login = (props: ILoginProps) => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<ILoginType>('account');
  const [qrcodeInfo, setQrcodeInfo] = useState<IQrcodeInfo | undefined>(
    undefined,
  );
  const [qrcodeStatus, setQrcodeStatus] = useState<IQrcodeStatus>('no-scan');
  const [qrcodeResult, setQrcodeResult] = useState<IKeyValue | undefined>(
    undefined,
  );
  const [delay, setDelay] = useState<number | undefined>(undefined); // undefined 为不轮询

  const generateQrcode = async () => {
    const [err, res] = await to<IQrcodeInfo>(request('/qrcode/generate'));
    if (isNull(err)) {
      setQrcodeInfo(res);
      setDelay(1000);
    }
  };

  const checkQrcode = async () => {
    if (!qrcodeInfo) return;
    const [err, res] = await to<{
      status: IQrcodeStatus;
      userInfo?: string;
    }>(request(`/qrcode/check?qrcodeId=${qrcodeInfo.qrcodeId}`));
    if (isNull(err)) {
      setQrcodeStatus(res!.status);
      if (res!.status === 'scan-confirm' && res) {
        setQrcodeResult(res);
      }
    }
  };

  const clear = useRafInterval(async () => {
    await checkQrcode();
  }, delay);

  useAsyncEffect(async () => {
    if (['scan-confirm', 'scan-cancel'].includes(qrcodeStatus)) {
      setDelay(undefined);
      clear();
    }
    if (qrcodeStatus === 'scan-confirm' && !isEmpty(qrcodeResult)) {
      await localforage.setItem('access_token', qrcodeResult?.data.accessToken);
      await localforage.setItem(
        'refresh_token',
        qrcodeResult?.data.refreshToken,
      );
      await localforage.setItem('user_info', qrcodeResult?.data.userInfo);
      message.success('扫码登录成功');
      navigate('/');
    }
  }, [qrcodeStatus, qrcodeResult]);

  useUnmount(() => {
    clear();
  });

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
      await localforage.setItem('access_token', res.access_token);
      await localforage.setItem('refresh_token', res.refresh_token);
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
    } else {
      setDelay(undefined);
    }
    setLoginType(key as ILoginType);
  };

  const items: TabsProps['items'] = [
    {
      key: 'account',
      label: '账户密码登录',
      children: (
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
      ),
    },
    {
      key: 'scan',
      label: '扫码登录',
      children: (
        <ScanWrap>
          <Image
            src={qrcodeInfo?.image}
            height={138}
            width={138}
            preview={false}
          />
          <h3>{QRCODE_STATUS_MAP_TITLE[qrcodeStatus]}</h3>
        </ScanWrap>
      ),
    },
  ];

  return (
    <Wrap>
      <LoginForm
        title="会议室预定系统管理端"
        subTitle="zxp"
        onFinish={handleFinish}
        initialValues={{
          username: 'zxp',
          password: '123456',
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={handleLoginTypeChange}
          items={items}
        />
        <FooterWrap>
          <Link to="/register">注册账号</Link>
        </FooterWrap>
      </LoginForm>
    </Wrap>
  );
};

export default Login;
