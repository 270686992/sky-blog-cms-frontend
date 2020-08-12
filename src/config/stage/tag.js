/**
 * 标签管理模块路由设置
 *
 * @author 踏雪彡寻梅
 * @date 2020/8/12 17:30
 */

const tagRouter = {
  route: null,
  name: null,
  title: '标签管理',
  type: 'folder',
  icon: 'el-icon-price-tag',
  filePath: 'view/tag/',
  order: null,
  inNav: true,
  children: [
    {
      title: '标签列表',
      type: 'view',
      name: 'tagList',
      route: '/tag/list',
      filePath: 'view/tag/tag-list.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default tagRouter
