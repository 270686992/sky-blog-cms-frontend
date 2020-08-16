/**
 * 文章评论管理模块路由配置
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/15 - 14:02
 */

const commentRouter = {
  route: null,
  name: null,
  title: '文章评论管理',
  type: 'folder',
  icon: 'el-icon-chat-dot-square',
  filePath: 'view/comment/',
  order: null,
  inNav: true,
  children: [
    {
      title: '评论列表',
      type: 'view',
      name: 'commentList',
      route: '/comment/list',
      filePath: 'view/comment/comment-list.vue',
      inNav: true,
      icon: '',
    },
    {
      title: '子评论列表',
      type: 'tab',
      name: 'subCommentList',
      route: '/sub-comment/:id/list',
      filePath: 'view/comment/sub-comment-list.vue',
      inNav: false,
      icon: '',
    },
  ],
}

export default commentRouter
