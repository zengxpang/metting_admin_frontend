import {
  ProForm,
  ProFormCaptcha,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useRef } from 'react';
import { useAsyncEffect } from 'ahooks';
import to from 'await-to-js';
import {
  getUserInfo,
  IUpdateUserInfo,
  updateUserInfo,
  updateUserInfoCaptcha,
} from '@/services';
import { Form, message } from 'antd';
import { isNull } from 'lodash-es';
import { UploadAvatar } from '@/components';

interface IUpdateInfoProps {}

const UpdateInfo = (props: IUpdateInfoProps) => {
  const formRef = useRef<ProFormInstance>();

  useAsyncEffect(async () => {
    const [err, res] = await to(getUserInfo());
    if (isNull(err)) {
      formRef.current?.setFieldsValue({
        nickName: res.nickName,
        headPic: res.headPic,
        email: res.email,
      });
    }
  }, []);

  const handleFinish = async (values: IKeyValue) => {
    const data: IUpdateUserInfo = {
      nickName: values.nickName,
      headPic: values.headPic,
      email: values.email,
      captcha: values.captcha,
    };
    const [err, res] = await to(updateUserInfo(data));
    if (isNull(err)) {
      message.success(res);
    } else {
      message.error(err);
    }
  };

  const handleGetCaptcha = async () => {
    const [err, res] = await to(updateUserInfoCaptcha());
    if (!isNull(err)) {
      message.error(err);
    } else {
      message.success(res);
    }
  };

  return (
    <div className="flex flex-col  justify-center items-center">
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
        <Form.Item
          name="headPic"
          label="头像"
          rules={[
            {
              required: true,
              message: '请输入头像',
            },
          ]}
        >
          <UploadAvatar />
        </Form.Item>
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
          name="email"
          label="邮箱"
          placeholder={'请输入邮箱'}
          fieldProps={{
            disabled: true,
          }}
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
    </div>
  );
};

UpdateInfo.defaultProps = {};

export default UpdateInfo;
