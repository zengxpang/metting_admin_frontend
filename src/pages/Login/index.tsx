import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, request } from '@umijs/max';
import to from 'await-to-js';
import { isNull } from 'lodash-es';
import { message } from 'antd';
import localforage from 'localforage';
import { useNavigate } from '@umijs/max';

interface ILoginProps {}

const Login = (props: ILoginProps) => {
  const navigate = useNavigate();

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
      console.log(res);
      await localforage.setItem('access_token', res.accessToken);
      await localforage.setItem('refresh_token', res.refreshToken);
      await localforage.setItem('user_info', res.userInfo);
      message.success('登录成功');
      navigate('/');
    } else {
      message.error(err.data);
    }
  };
  return (
    <LoginForm
      title="会议室预定系统管理端"
      subTitle="zxp"
      onFinish={handleFinish}
      initialValues={{
        username: 'zhangsan',
        password: '333333',
      }}
    >
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
      <div className="flex justify-between mb-8px ">
        <Link to="/register">注册账号</Link>
        <Link to="/updatePassword">忘记密码</Link>
      </div>
    </LoginForm>
  );
};

export default Login;
