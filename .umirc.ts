import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '会议室预定系统管理端',
  },
  proxy: {
    '/api': {
      target: 'http://localhost:30086/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  routes: [
    {
      path: '/',
      redirect: '/meetingRoomManage',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      name: '确认登录',
      path: '/loginConfirm',
      component: './LoginConfirm',
      layout: false,
    },
    {
      name: '修改信息',
      path: '/updateInfo',
      component: './UpdateInfo',
      hideInMenu: true,
    },
    {
      name: '忘记密码',
      path: '/updatePassword',
      component: './UpdatePassword',
      hideInMenu: true,
    },
    {
      name: '注册',
      path: '/register',
      component: './Register',
      layout: false,
    },
    {
      name: '会议室管理',
      path: '/meetingRoomManage',
      component: './MeetingRoomManage',
    },
    {
      name: '用户管理',
      path: '/userManage',
      component: './UserManage',
    },
    {
      name: '预定管理',
      path: '/bookingManage',
      component: './BookingManage',
    },
    {
      name: '统计',
      path: '/statistic',
      component: './Statistic',
    },
  ],
  npmClient: 'pnpm',
});
