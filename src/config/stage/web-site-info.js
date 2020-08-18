/**
 * 站点信息管理路由配置
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/18 - 17:19
 */

const webSiteInfoRouter = {
  route: null,
  name: null,
  title: '站点信息管理',
  type: 'folder',
  icon: 'el-icon-setting',
  filePath: 'view/web-site-info/',
  order: null,
  inNav: true,
  children: [
    {
      title: '添加站点信息',
      type: 'view',
      name: 'webSiteInfoCreate',
      route: '/web-site-info/add',
      filePath: 'view/web-site-info/web-site-info-create.vue',
      inNav: true,
      icon: '',
    },
    {
      title: '站点信息列表',
      type: 'view',
      name: 'webSiteInfoList',
      route: '/web-site-info/list',
      filePath: 'view/web-site-info/web-site-info-list.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default webSiteInfoRouter
