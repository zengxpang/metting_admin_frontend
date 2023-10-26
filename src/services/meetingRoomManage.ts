import { request } from '@umijs/max';

export const deleteMeetingRoom = (id: number) => {
  return request(`/meeting-room/${id}`, {
    method: 'DELETE',
  });
};

export interface IMeetingRoom {
  name: string;
  capacity: number;
  location: string;
  description?: string;
  equipment?: string;
  id?: number;
}

export const updateMeetingRoom = (meetingRoom: IMeetingRoom) => {
  return request('/meeting-room/update', {
    method: 'POST',
    data: meetingRoom,
  });
};

export const createMeetingRoom = (meetingRoom: IMeetingRoom) => {
  return request('/meeting-room/create', {
    method: 'POST',
    data: meetingRoom,
  });
};
