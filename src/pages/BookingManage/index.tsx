import React, { useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import to from 'await-to-js';
import { request } from '@umijs/max';
import dayjs from 'dayjs';
import { isNull, pickBy } from 'lodash-es';

import { getRGBA } from '@/utils';

import { STATUS_MAP_TEXT, STATUS_MAP_COLOR, IStatus } from './constants';
import { applyBooking, rejectBooking, unbindBooking } from '@/services';

const BookingManage = () => {
  const actionRef = useRef<ActionType>();

  const handleApplyClick = async (id: string) => {
    const [err, _] = await to(applyBooking(id));
    if (isNull(err)) {
      actionRef.current?.reload();
      message.success('通过成功');
    }
  };
  const handleRejectClick = async (id: string) => {
    const [err, _] = await to(rejectBooking(id));
    if (isNull(err)) {
      actionRef.current?.reload();
      message.success('驳回成功');
    }
  };
  const handleUnbindClick = async (id: string) => {
    const [err, _] = await to(unbindBooking(id));
    if (isNull(err)) {
      actionRef.current?.reload();
      message.success('解除成功');
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
      title: '会议室名称',
      key: 'meetingRoomName',
      width: 100,
      ellipsis: true,
      render: (_, record) => {
        return record?.room?.name;
      },
    },
    {
      title: '会议室位置',
      key: 'meetingRoomPosition',
      width: 120,
      ellipsis: true,
      render: (_, record) => {
        return record?.room?.location;
      },
    },
    {
      title: '预定人',
      key: 'username',
      ellipsis: true,
      width: 80,
      render: (_, record) => {
        return record?.user?.username;
      },
    },
    {
      title: '开始时间',
      valueType: 'dateTime',
      sorter: true,
      key: 'bookingTimeRangeStart',
      dataIndex: 'startTime',
      width: 160,
      search: {
        transform: (value) => {
          return value ? dayjs(value).valueOf() : undefined;
        },
      },
    },
    {
      title: '结束时间',
      valueType: 'dateTime',
      sorter: true,
      key: 'bookingTimeRangeEnd',
      dataIndex: 'endTime',
      width: 160,
      search: {
        transform: (value) => {
          return value ? dayjs(value).valueOf() : undefined;
        },
      },
    },
    {
      title: '预定时间',
      key: 'createTime',
      valueType: 'dateTime',
      sorter: true,
      width: 160,
      hideInSearch: true,
      dataIndex: 'createTime',
    },
    {
      title: '审批状态',
      key: 'status',
      hideInSearch: true,
      width: 80,
      render: (_, record) => {
        const status: IStatus = record?.status;
        const color = STATUS_MAP_COLOR[status];
        const text = STATUS_MAP_TEXT[status];
        return (
          <Tag
            style={{
              color: color,
              borderColor: getRGBA(color, 0.1),
              background: getRGBA(color, 0.1),
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: '备注',
      key: 'note',
      dataIndex: 'note',
      ellipsis: true,
      hideInSearch: true,
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space>
            <Popconfirm
              title={'是否通过该申请'}
              key={'delete'}
              description={'你确定通过该申请吗?'}
              okText={'确定'}
              cancelText={'取消'}
              onConfirm={() => handleApplyClick(record?.id)}
            >
              <Button ghost size={'small'} type={'primary'}>
                通过
              </Button>
            </Popconfirm>
            <Popconfirm
              title={'是否驳回该申请'}
              description={'你确定驳回该申请吗?'}
              okText={'确定'}
              cancelText={'取消'}
              onConfirm={() => handleRejectClick(record?.id)}
            >
              <Button ghost size={'small'} type={'primary'}>
                驳回
              </Button>
            </Popconfirm>
            <Popconfirm
              title={'是否解除该申请'}
              description={'你确定解除该申请吗?'}
              okText={'确定'}
              cancelText={'取消'}
              onConfirm={() => handleUnbindClick(record?.id)}
            >
              <Button ghost size={'small'} type={'primary'} danger>
                解除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <ProTable<IKeyValue>
      rowKey={'id'}
      columns={columns}
      actionRef={actionRef}
      scroll={{ x: 'max-content' }}
      request={async (params) => {
        const { current, pageSize, ...restParams } = params;
        const [_, data] = await to(
          request('/booking/list', {
            method: 'GET',
            params: pickBy({
              pageNum: current,
              pageSize: pageSize,
              ...restParams,
            }),
          }),
        );
        return {
          data: data?.bookings ?? [],
          success: true,
          total: data?.totalCount ?? 0,
        };
      }}
      toolBarRender={() => []}
    />
  );
};

export default BookingManage;
