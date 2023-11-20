import { request } from '@umijs/max';

export const getUserBookingCount = (startTime: string, endTime: string) => {
  return request('/statistic/userBookingCount', {
    method: 'GET',
    params: {
      startTime,
      endTime,
    },
  });
};

export const getMeetingRoomUsedCount = (startTime: string, endTime: string) => {
  return request('/statistic/meetingRoomUsedCount', {
    method: 'GET',
    params: {
      startTime,
      endTime,
    },
  });
};
