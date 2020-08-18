/**
 * 友情链接管理模块路由配置
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/14 - 14:40
 */

const friendLinkRouter = {
  route: null,
  name: null,
  title: '友情链接管理',
  type: 'folder',
  icon: 'el-icon-link',
  filePath: 'view/friend-link/',
  order: null,
  inNav: true,
  children: [
    {
      title: '友情链接列表',
      type: 'view',
      name: 'friendLinkList',
      route: '/friend-link/list',
      filePath: 'view/friend-link/friend-link-list.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default friendLinkRouter
