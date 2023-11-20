export type IStatus = '1' | '2' | '3' | '4';

export const STATUS_MAP_TEXT = {
  1: '申请中',
  2: '审批通过',
  3: '审批驳回',
  4: '已解除',
};

export const STATUS_MAP_COLOR = {
  1: '#F98110',
  2: '#4285F4',
  3: '#009944',
  4: '#DB4437',
};
