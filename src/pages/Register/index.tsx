import {
  ProForm,
  ProFormCaptcha,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, Col, Row, Space, message } from 'antd';
import { UploadAvatar } from '@/components';
import { styled, useNavigate } from '@umijs/max';
import { useRef } from 'react';
import to from 'await-to-js';
import { isNil } from 'lodash-es';

import { IRegisterUser, register, registerCaptcha } from '@/services';

const Wrap = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

interface IRegisterProps {}

const Register = (props: IRegisterProps) => {
  const formRef = useRef<ProFormInstance>();
  const navigate = useNavigate();

  const handleFinish = async (values: IKeyValue) => {
    const {
      captcha,
      email,
      nickName,
      password,
      username,
      headPic,
      phoneNumber,
    } = values;
    const data: IRegisterUser = {
      captcha,
      email,
      nickName,
      password,
      username,
      headPic,
      phoneNumber,
      isAdmin: true,
    };
    const [err] = await to(register(data));
    if (isNil(err)) {
      message.success('注册成功,2s后跳转到登录页');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      message.error(err);
    }
  };

  const handleGetCaptcha = async () => {
    const email = formRef.current?.getFieldValue('email');
    const [err, res] = await to(registerCaptcha(email));
    if (!isNil(err)) {
      message.error(err);
    } else {
      message.success(res);
    }
  };

  const handleReset = () => {
    navigate('/login');
  };

  return (
    <Wrap>
      <ProForm
        {...formItemLayout}
        layout="horizontal"
        onFinish={handleFinish}
        onReset={handleReset}
        formRef={formRef}
        submitter={{
          searchConfig: {
            submitText: '确认注册',
            resetText: '取消注册',
          },
          render: (_, doms) => {
            return (
              <Row>
                <Col span={16} offset={6}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            );
          },
        }}
      >
        <Form.Item name="headPic" label="头像">
          <UploadAvatar />
        </Form.Item>
        <ProFormText
          width="md"
          name="username"
          label="用户名"
          placeholder={'请输入用户名'}
          tooltip="默认注册为管理员"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="nickName"
          label="昵称"
          placeholder={'请输入昵称'}
          rules={[
            {
              required: true,
              message: '请输入昵称',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="phoneNumber"
          label="电话"
          placeholder={'请输入电话'}
          rules={[
            {
              validator: (_, value) => {
                if (!value || /^1[3456789]\d{9}$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('请输入正确的电话号码'));
              },
            },
          ]}
        />
        <ProFormText.Password
          width="md"
          name="password"
          label="密码"
          placeholder={'请输入密码'}
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
            {
              min: 6,
              message: '密码至少6位',
            },
          ]}
        />
        <ProFormText.Password
          width="md"
          name="confirmPassword"
          label="确认密码"
          placeholder={'请再次输入密码'}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: '请再次输入密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                console.log(getFieldValue('password') === value);
                return Promise.reject(new Error('确认密码与密码不匹配!'));
              },
            }),
          ]}
        />
        <ProFormText
          width="md"
          name="email"
          label="邮箱"
          placeholder={'请输入邮箱'}
          rules={[
            { type: 'email', message: '请输入正确的邮箱地址' },
            {
              required: true,
              message: '请输入邮箱',
            },
          ]}
        />
        <ProFormCaptcha
          label="验证码"
          placeholder={'请输入验证码'}
          captchaTextRender={(timing, count) => {
            if (timing) {
              return `${count} ${'获取验证码'}`;
            }
            return '获取验证码';
          }}
          name="captcha"
          phoneName="email"
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
          ]}
          onGetCaptcha={handleGetCaptcha}
        />
      </ProForm>
    </Wrap>
  );
};

Register.defaultProps = {};

export default Register;
