import { Button, message, Space } from 'antd';
import { useMount } from 'ahooks';
import queryString from 'query-string';
import { request, styled } from '@umijs/max';
import to from 'await-to-js';
import { isNull } from 'lodash-es';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

interface ILoginConfirmProps {}

const LoginConfirm = (props: ILoginConfirmProps) => {
  const search = window?.location.search;
  const { qrcodeId } = queryString.parse(search);

  useMount(async () => {
    const [err] = await to(request(`/qrcode/scan?qrcodeId=${qrcodeId}`));
    if (!isNull(err)) {
      message.error('二维码已过期');
    }
  });

  const handleLoginAdmin = async () => {
    const [err, res] = await to(
      request('/user/admin/login', {
        method: 'post',
        data: {
          username: 'zhangsan',
          password: '1111111',
        },
      }),
    );
    if (isNull(err)) {
      const [theErr, _] = await to(
        request(`/qrcode/confirm?qrcodeId=${qrcodeId}`, {
          headers: {
            Authorization: `Bearer ${res.accessToken}`,
          },
        }),
      );
      if (isNull(theErr)) {
        message.success('登录admin成功');
      }
    }
  };

  const handleLoginCancel = async () => {
    const [err] = await to(request(`/qrcode/cancel?qrcodeId=${qrcodeId}`));
    if (isNull(err)) {
      message.success('取消登录成功');
    } else {
      message.error('二维码已过期');
    }
  };

  return (
    <Wrap>
      <h3 style={{ marginBottom: 16 }}>俺要登录～</h3>
      <Space size={32}>
        <Button type="primary" onClick={handleLoginAdmin}>
          登录 admin
        </Button>
        <Button onClick={handleLoginCancel}>取消登录</Button>
      </Space>
      {qrcodeId}
    </Wrap>
  );
};

LoginConfirm.defaultProps = {};

export default LoginConfirm;
