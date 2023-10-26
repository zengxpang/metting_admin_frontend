import {
  DrawerForm,
  ProFormInstance,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-components';
import { message } from 'antd';
import to from 'await-to-js';
import { isEmpty, isNull } from 'lodash-es';
import { useMemo, useRef } from 'react';

import { CREATE_MEETING_ROOM, UPDATE_MEETING_ROOM } from './constants';
import { createMeetingRoom, IMeetingRoom, updateMeetingRoom } from '@/services';

interface ICreateAndUpdateDrawerProps {
  trigger: JSX.Element;
  onSubmit: () => void;
  data?: IMeetingRoom;
}

const CreateAndUpdateDrawer = (props: ICreateAndUpdateDrawerProps) => {
  const { trigger, onSubmit, data } = props;
  const formRef = useRef<ProFormInstance>(null);

  const title = useMemo(() => {
    return isEmpty(data) ? CREATE_MEETING_ROOM : UPDATE_MEETING_ROOM;
  }, [data]);

  const msg = useMemo(() => {
    return isEmpty(data) ? CREATE_MEETING_ROOM : UPDATE_MEETING_ROOM + '成功';
  }, [data]);

  const handleOpenChange = (open: boolean) => {
    if (open && !isEmpty(data)) {
      const { capacity, description, equipment, name, location } = data;
      // 设置了drawer的forceRender预渲染这里forRef.current 才不为null
      formRef?.current?.setFieldsValue({
        name,
        capacity,
        location,
        equipment,
        description,
      });
    }
  };

  const handleFinish = async (values: any) => {
    if (isEmpty(data)) {
      const [error] = await to(createMeetingRoom(values));
      if (isNull(error)) {
        message.success(msg);
        onSubmit();
      }
    } else {
      const id = data?.id;
      const params = {
        ...values,
        id,
      };
      const [error] = await to(updateMeetingRoom(params));
      if (isNull(error)) {
        message.success(msg);
        onSubmit();
      }
    }

    // 不返回不会关闭弹框
    return true;
  };

  return (
    <DrawerForm
      formRef={formRef}
      title={title}
      width={600}
      drawerProps={{
        destroyOnClose: true,
        forceRender: true,
        maskClosable: false,
      }}
      trigger={trigger}
      onFinish={handleFinish}
      onOpenChange={handleOpenChange}
    >
      <ProFormText
        name="name"
        label="名称"
        placeholder="请输入名称"
        rules={[
          {
            required: true,
            message: '名称不能为空',
          },
          {
            max: 50,
            message: '名称最多50个字符',
          },
        ]}
      />
      <ProFormDigit
        label="容纳人数"
        name="capacity"
        placeholder="请输入容纳人数"
        rules={[
          {
            required: true,
            message: '容纳人数不能为空',
          },
        ]}
      />
      <ProFormText
        name="location"
        label="位置"
        placeholder="请输入位置"
        rules={[
          {
            required: true,
            message: '位置不能为空',
          },
          {
            max: 50,
            message: '位置最多50个字符',
          },
        ]}
      />
      <ProFormText
        name="equipment"
        label="设备"
        placeholder="请输入设备"
        rules={[
          {
            max: 50,
            message: '设备最多50个字符',
          },
        ]}
      />
      <ProFormText
        name="description"
        label="描述"
        placeholder="请输入描述"
        rules={[
          {
            max: 50,
            message: '设备最多50个字符',
          },
        ]}
      />
    </DrawerForm>
  );
};

CreateAndUpdateDrawer.defaultProps = {
  data: null,
};

export default CreateAndUpdateDrawer;
