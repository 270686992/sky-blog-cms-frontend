/**
 * 文章分类管理模块路由配置
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/12 - 14:10
 */

const categoryRouter = {
  route: null,
  name: null,
  title: '文章分类管理',
  type: 'folder',
  icon: 'el-icon-guide',
  filePath: 'view/category/',
  order: null,
  inNav: true,
  children: [
    {
      title: '文章分类列表',
      type: 'view',
      name: 'categoryList',
      route: '/category/list',
      filePath: 'view/category/category-list.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default categoryRouter
