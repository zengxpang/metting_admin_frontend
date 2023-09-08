import React, { useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import to from 'await-to-js';
import { Image, Tag } from 'antd';

const UserManage = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<IKeyValue>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      copyable: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      copyable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true,
      tip: '邮箱过长会自动收缩',
    },
    {
      title: '头像',
      dataIndex: 'headPic',
      hideInSearch: true,
      render: (_, record) => {
        return record.headPic ? (
          <Image
            alt={'avatar'}
            width={30}
            height={30}
            src={`http://localhost:3000/${record.headPic}`}
          />
        ) : (
          '-'
        );
      },
    },
    {
      title: '电话',
      dataIndex: 'phoneNumber',
      ellipsis: true,
      tip: '邮箱过长会自动收缩',
      hideInSearch: true,
    },
    {
      title: '是否冻结',
      dataIndex: 'isFreeze',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Tag color={record.isFreeze ? 'red' : 'green'}>
            {record.isFreeze ? '是' : '否'}
          </Tag>
        );
      },
    },
    {
      title: '是否管理员',
      dataIndex: 'isAdmin',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <Tag color={record.isAdmin ? 'red' : 'green'}>
            {record.isAdmin ? '是' : '否'}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
  ];
  return (
    <ProTable<IKeyValue>
      rowKey={'id'}
      columns={columns}
      actionRef={actionRef}
      request={async (params) => {
        const { current, pageSize, username, ...restParams } = params;
        const [_, data] = await to(
          request('/user/list', {
            method: 'GET',
            params: {
              pageNum: current,
              pageSize: pageSize,
              userName: username,
              ...restParams,
            },
          }),
        );
        return {
          data: data?.users,
          success: true,
          total: data?.totalCount ?? 0,
        };
      }}
    />
  );
};

export default UserManage;
