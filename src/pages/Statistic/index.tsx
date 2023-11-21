import React, { useState } from 'react';
import {
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  Rectangle,
} from 'recharts';
import {
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { useAsyncEffect } from 'ahooks';
import dayjs from 'dayjs';
import { Empty } from 'antd';

import { getMeetingRoomUsedCount, getUserBookingCount } from '@/services';

interface IStatistic {}

interface IFormValue {
  dateRange: string[];
  type: '1' | '2';
}

const initialValues = {
  dateRange: [
    dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ],
  type: '1',
};
const Statistic = (props: IStatistic) => {
  const [userBookingCount, setUserBookingCount] = useState<IKeyValue[]>([]);
  const [meetingRoomUsedCount, setMeetingRoomUsedCount] = useState<IKeyValue[]>(
    [],
  );
  const [type, setType] = useState<IFormValue['type']>(
    initialValues.type as '1',
  );
  const [dateRange, setDateRange] = useState<IFormValue['dateRange']>(
    initialValues.dateRange,
  );

  useAsyncEffect(async () => {
    if (!dateRange || dateRange.length < 2) return;
    const startTime = dateRange[0];
    const endTime = dateRange[1];
    setUserBookingCount(await getUserBookingCount(startTime, endTime));
    setMeetingRoomUsedCount(await getMeetingRoomUsedCount(startTime, endTime));
  }, [dateRange]);

  const handleChange = (_: any, values: IFormValue) => {
    const { type, dateRange } = values;
    setType(type);
    setDateRange(dateRange);
  };

  const renderChart = () => {
    return type === '1' ? (
      <>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={userBookingCount}
            margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="username" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bookingCount" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={meetingRoomUsedCount}
            margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="meetingRoomName" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="usedCount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </>
    ) : type === '2' ? (
      <>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={userBookingCount}
            margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
            maxBarSize={12}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="username" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="bookingCount"
              fill="#82ca9d"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={meetingRoomUsedCount}
            margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
            maxBarSize={12}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="meetingRoomName" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="usedCount"
              fill="#8884d8"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </>
    ) : (
      <>
        <Empty />
        <Empty />
      </>
    );
  };

  return (
    <>
      <ProForm
        layout={'inline'}
        style={{
          marginBottom: 24,
        }}
        initialValues={initialValues}
        onValuesChange={handleChange}
        submitter={{
          render: () => {
            return [];
          },
        }}
      >
        <ProFormDateRangePicker
          width="md"
          label="查询范围"
          name="dateRange"
          rules={[
            {
              required: true,
              message: '请选择查询范围',
              type: 'array',
            },
          ]}
        />
        <ProFormSelect
          width="md"
          label="图表类型"
          name="type"
          valueEnum={{
            1: '折线图',
            2: '饼图',
          }}
          rules={[
            {
              required: true,
              message: '请选择图表类型',
            },
          ]}
        />
      </ProForm>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          justifyItems: 'center',
          rowGap: 16,
          height: 300,
        }}
      >
        {renderChart()}
        <strong>用户预定情况</strong>
        <strong>会议室使用情况</strong>
      </div>
    </>
  );
};

Statistic.defaultProps = {};

export default Statistic;
