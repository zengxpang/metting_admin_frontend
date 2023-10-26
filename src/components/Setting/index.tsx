import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import LoginOut from './LoginOut';
import UpdateInfo from './UpdateInfo';
import UpdatePassword from './UpdatePassword';

interface ISettingProps {}

const Setting = (props: ISettingProps) => {
  const items: MenuProps['items'] = [
    {
      key: 'updateInfo',
      label: <UpdateInfo />,
    },
    {
      key: 'updatePassword',
      label: <UpdatePassword />,
    },
    {
      key: 'layout',
      label: <LoginOut />,
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <SettingOutlined style={{ cursor: 'pointer' }} />
    </Dropdown>
  );
};

Setting.defaultProps = {};

export default Setting;
