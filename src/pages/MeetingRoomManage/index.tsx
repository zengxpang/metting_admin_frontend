import React, { useRef } from 'react';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import to from 'await-to-js';
import { Button, message, Popconfirm, Tag } from 'antd';
import { isNull } from 'lodash-es';

import { deleteMeetingRoom, IMeetingRoom } from '@/services';
import CreateAndUpdateDrawer from '@/pages/MeetingRoomManage/components/CreateAndUpdateDrawer';
import { BaseProTable } from '@/components';

interface IMeetingRoomManageProps {}

const MeetingRoomManage = (props: IMeetingRoomManageProps) => {
  const actionRef = useRef<ActionType>();

  const handleDelete = async (id: number) => {
    const [err, _] = await to(deleteMeetingRoom(id));
    if (isNull(err)) {
      message.success('删除成功');
      actionRef.current?.reload();
    } else {
      message.error(err.data);
    }
  };

  const columns: ProColumns<IKeyValue>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      key: 'index',
      width: 48,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      copyable: true,
      width: 80,
    },
    {
      title: '容纳人数',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 80,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '设备',
      dataIndex: 'equipment',
      key: 'equipment',
      ellipsis: true,
      tip: '设备过长会自动收缩',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      key: 'description',
      tip: '描述过长会自动收缩',
      hideInSearch: true,
    },
    {
      title: '是否预定',
      dataIndex: 'isBooked',
      key: 'isBooked',
      hideInSearch: true,
      width: 80,
      render: (_, record) => {
        return (
          <Tag color={record.isBooked ? 'red' : 'green'}>
            {record.isBooked ? '已被预定' : '可预定'}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      key: 'createdTime',
      dataIndex: 'createdTime',
      valueType: 'date',
      sorter: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      key: 'updatedTime',
      dataIndex: 'updatedTime',
      valueType: 'date',
      sorter: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      key: 'action',
      fixed: 'right',
      render: (_, record, action) => [
        <Popconfirm
          title={'是否删除会议室'}
          key={'delete'}
          description={'你确定删除该会议室吗?'}
          okText={'确定'}
          cancelText={'取消'}
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type={'default'} ghost danger size={'small'}>
            删除
          </Button>
        </Popconfirm>,
        <CreateAndUpdateDrawer
          key={'update'}
          onSubmit={() => {
            actionRef.current?.reload();
          }}
          data={record as IMeetingRoom}
          trigger={
            <Button type={'primary'} ghost size={'small'}>
              更新
            </Button>
          }
        />,
      ],
    },
  ];

  return (
    <BaseProTable<IKeyValue>
      headerTitle={'会议室管理'}
      rowKey={'id'}
      columns={columns}
      actionRef={actionRef}
      scroll={{ x: 'max-content' }}
      request={async (params) => {
        const { current, pageSize, ...restParams } = params;
        const [_, data] = await to(
          request('/meeting-room/list', {
            method: 'GET',
            params: {
              pageNum: current,
              pageSize: pageSize,
              ...restParams,
            },
          }),
        );
        return {
          data: data?.meetingRooms,
          success: true,
          total: data?.totalCount ?? 0,
        };
      }}
      toolBarRender={() => [
        <CreateAndUpdateDrawer
          key="create"
          onSubmit={() => {
            actionRef.current?.reload();
          }}
          trigger={<Button>创建会议室</Button>}
        />,
      ]}
    />
  );
};

MeetingRoomManage.defaultProps = {};

export default MeetingRoomManage;
