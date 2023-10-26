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
  plugins: [require.resolve('@umijs/plugins/dist/unocss')],
  unocss: {
    // 检测 className 的文件范围，若项目不包含 src 目录，可使用 `pages/**/*.tsx`
    watch: ['src/**/*.tsx', 'src/**/*.jsx'],
  },
  proxy: {
    '/api': {
      target: 'http://localhost:3000/',
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
      path: 'scheduleManage',
      component: './ScheduleManage',
    },
  ],
  npmClient: 'pnpm',
});
