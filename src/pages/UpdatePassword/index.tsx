import {
  ProForm,
  ProFormCaptcha,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import {
  getUserInfo,
  IUpdatePassword,
  updatePassword,
  updatePasswordCaptcha,
} from '@/services';
import to from 'await-to-js';
import { isNull } from 'lodash-es';
import { message } from 'antd';
import { useNavigate } from '@umijs/max';
import { useAsyncEffect } from 'ahooks';
import { useRef } from 'react';

interface IUpdatePasswordProps {}

const UpdatePassword = (props: IUpdatePasswordProps) => {
  const navigate = useNavigate();
  const formRef = useRef<ProFormInstance>();

  useAsyncEffect(async () => {
    const [err, res] = await to(getUserInfo());
    if (isNull(err)) {
      formRef.current?.setFieldsValue({
        nickName: res.nickName,
        headPic: res.headPic,
        email: res.email,
        username: res.username,
      });
    }
  }, []);

  const handleFinish = async (
    values: IUpdatePassword & {
      confirmPassword: string;
    },
  ) => {
    const { confirmPassword, ...rest } = values;
    const [err, res] = await to(updatePassword(rest));
    if (isNull(err)) {
      message.success(res);
      navigate('/login');
    } else {
      message.error(err);
    }
  };

  const handleGetCaptcha = async (email: string) => {
    const [err, res] = await to(updatePasswordCaptcha(email));
    if (isNull(err)) {
      message.success(res);
    } else {
      message.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="font-600 font-size-33px mb-4">会议室预定系统</div>
      <ProForm
        layout="vertical"
        onFinish={handleFinish}
        formRef={formRef}
        submitter={{
          searchConfig: {
            submitText: '修改',
          },
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
          submitButtonProps: {
            style: {
              width: '100%',
            },
          },
        }}
      >
        <ProFormText
          width="md"
          name="username"
          label="用户名"
          disabled
          placeholder={'请输入用户名'}
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="email"
          label="邮箱"
          placeholder={'请输入邮箱'}
          disabled
          rules={[
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
      </ProForm>
    </div>
  );
};

UpdatePassword.defaultProps = {};

export default UpdatePassword;
