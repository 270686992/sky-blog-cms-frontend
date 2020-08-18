/**
 * 留言管理模块路由配置
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/17 - 13:26
 */

const leaveMessageRouter = {
  route: null,
  name: null,
  title: '留言管理',
  type: 'folder',
  icon: 'el-icon-message',
  filePath: 'view/leave-message/',
  order: null,
  inNav: true,
  children: [
    {
      title: '留言列表',
      type: 'view',
      name: 'leaveMessageList',
      route: '/leave-message/list',
      filePath: 'view/leave-message/leave-message-list.vue',
      inNav: true,
      icon: '',
    },
    {
      title: '子留言列表',
      type: 'tab',
      name: 'subLeaveMessageList',
      route: '/sub-leave-message/:id/list',
      filePath: 'view/leave-message/sub-leave-message-list.vue',
      inNav: false,
      icon: '',
    },
  ],
}

export default leaveMessageRouter
