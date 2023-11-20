import { request } from '@umijs/max';

export const applyBooking = (id: string) => {
  return request(`/booking/apply/${id}`);
};

export const rejectBooking = (id: string) => {
  return request(`/booking/reject/${id}`);
};

export const unbindBooking = (id: string) => {
  return request(`/booking/unbind/${id}`);
};
