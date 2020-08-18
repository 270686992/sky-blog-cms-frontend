/**
 * 博客用户管理模块路由配置
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/18 - 14:18
 */

const customerRouter = {
  route: null,
  name: null,
  title: '博客用户管理',
  type: 'folder',
  icon: 'el-icon-user',
  filePath: 'view/customer/',
  order: null,
  inNav: true,
  children: [
    {
      title: '用户列表',
      type: 'view',
      name: 'customerList',
      route: '/customer/list',
      filePath: 'view/customer/customer-list.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default customerRouter
