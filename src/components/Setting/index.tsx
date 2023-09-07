import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import LoginOut from './LoginOut';
import UpdateInfo from './UpdateInfo';

interface ISettingProps {}

const Setting = (props: ISettingProps) => {
  const items: MenuProps['items'] = [
    {
      key: 'updateInfo',
      label: <UpdateInfo />,
    },
    {
      key: 'layout',
      label: <LoginOut />,
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <SettingOutlined />
    </Dropdown>
  );
};

Setting.defaultProps = {};

export default Setting;
