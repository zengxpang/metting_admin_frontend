import { message, Upload, UploadProps } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { noop } from 'unocss';

interface IUploadAvatarProps {
  onChange?: (url: string) => void;
  value?: string;
}

const prefix = 'http://localhost:30086/';

const UploadAvatar = (props: IUploadAvatarProps) => {
  const { onChange, value } = props;

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (value && imageUrl !== value) {
      setImageUrl(value);
    }
  }, [value]);

  const handleBeforeUpload = (file: RcFile) => {
    const isSupport = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/png',
    ].includes(file.type);
    if (!isSupport) {
      message.error('文件格式错误,只支持.png、.jpeg、.jpg、.gif格式');
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('图片大小不能超过3M');
    }
    return isSupport && isLt3M;
  };

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      if (onChange) {
        onChange(info.file.response.data);
      }
      setLoading(false);
      setImageUrl(info.file.response.data);
      message.success(`${info.file.name}上传成功`);
    }
    if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  };

  const uploadButton = loading ? <LoadingOutlined /> : <PlusOutlined />;

  return (
    <>
      <Upload
        name="file"
        showUploadList={false}
        onChange={handleChange}
        beforeUpload={handleBeforeUpload}
        multiple={false}
        listType="picture-circle"
        action={`${prefix}user/upload`}
      >
        {imageUrl ? (
          <img
            src={`${prefix}${imageUrl}`}
            alt="avatar"
            style={{ width: '100%', borderRadius: '50%' }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  );
};

UploadAvatar.defaultProps = {
  onChange: noop,
};

export default UploadAvatar;
