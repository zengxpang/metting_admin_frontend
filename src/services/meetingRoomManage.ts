import { request } from '@umijs/max';

export const deleteMeetingRoom = (id: number) => {
  return request(`/meeting-room/${id}`, {
    method: 'DELETE',
  });
};
