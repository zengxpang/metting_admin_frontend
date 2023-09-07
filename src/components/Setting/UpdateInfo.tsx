import { Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';

interface IUpdateInfoProps {}

const UpdateInfo = (props: IUpdateInfoProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/updateInfo');
  };
  return (
    <Space onClick={handleClick}>
      <UserOutlined />
      修改信息
    </Space>
  );
};

UpdateInfo.defaultProps = {};

export default UpdateInfo;
