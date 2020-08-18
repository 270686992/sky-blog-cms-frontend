<template>
  <div>
    <div v-if="!showEdit" class="container">
      <div class="header">
        <div class="title">文章列表</div>
      </div>

      <el-table stripe v-loading="loading" :data="tableData">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>

        <el-table-column prop="icon" label="封面图" width="150">
          <template v-if="scope.row.cover_image" slot-scope="scope">
            <el-image class="display_img" :src="scope.row.cover_image" :preview-src-list="imgSrcList"></el-image>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题" min-width="100"></el-table-column>

        <el-table-column prop="priority" label="权重" min-width="100"></el-table-column>

        <el-table-column prop="views" label="阅读量" min-width="100"></el-table-column>

        <el-table-column prop="comment_number" label="评论数" min-width="100"></el-table-column>

        <el-table-column prop="kind" label="文章类型" min-width="100">
          <template slot-scope="scope">{{ scope.row.kind | kindFormat }}</template>
        </el-table-column>

        <el-table-column prop="publish_state" label="发布状态" min-width="100">
          <template slot-scope="scope">{{ scope.row.publish_state | publishStateFormat }}</template>
        </el-table-column>

        <el-table-column prop="enable_comment" label="评论开启状态" min-width="120">
          <template slot-scope="scope">{{ scope.row.enable_comment | enableCommentFormat }}</template>
        </el-table-column>

        <el-table-column fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>

            <el-button
              @click.prevent="handleDelete(scope.row)"
              type="danger"
              plain
              size="mini"
              v-permission="{ permission: '删除文章', type: 'disabled' }"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :page-size="pageCount"
          :current-page="currentPage"
          v-if="refreshPagination"
          layout="prev, pager, next, jumper"
          :total="totalNums"
        ></el-pagination>
      </div>
    </div>

    <!--  更新文章页面  -->
    <article-edit v-else :articleId="articleId" @editClose="editClose"></article-edit>
  </div>
</template>

<script>
import Article from '@/model/article'
import ArticleEdit from './article-edit'

export default {
  components: {
    ArticleEdit,
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      tableData: [],
      articleId: 0,
      imgSrcList: [], // 用于大图预览
      totalNums: 0,
      currentPage: 1,
      pageCount: 10,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新 Pagination 组件
      showEdit: false, // 是否显示更新文章页面
    }
  },
  async created() {
    this.loading = true
    this.getArticleList()
    this.loading = false
  },
  filters: {
    publishStateFormat(val) {
      return val === 1 ? '发布' : '私密'
    },
    kindFormat(val) {
      return val === 1 ? '原创' : '转载'
    },
    enableCommentFormat(val) {
      return val === 1 ? '开启' : '关闭'
    },
  },
  methods: {
    // 获取文章列表
    async getArticleList() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const articleList = await Article.getArticleListByPage(page, count)
      this.tableData = articleList.items
      this.totalNums = articleList.total
      this.initImgSrcList()
    },
    // 切换 table 页
    async handleCurrentChange(val) {
      this.imgSrcList = []
      this.currentPage = val
      this.loading = true
      this.getArticleList()
      this.loading = false
    },
    // 初始化用于大图预览的图片 url 列表
    initImgSrcList() {
      this.tableData.forEach(item => {
        if (!item.cover_image) {
          return
        }
        this.imgSrcList.push(item.cover_image)
      })
    },
    // 监听更新文章
    handleEdit(val) {
      this.articleId = val.id
      this.showEdit = true
    },
    // 监听删除文章
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该文章，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Article.deleteArticleById(val.id)
        } catch (e) {
          this.loading = false
          console.error(e)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.loading = false
          if (this.totalNums % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          this.getArticleList()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        } else {
          this.loading = false
          this.$message.error(`${res.message}`)
        }
      })
    },
    // 监听更新文章页面关闭
    editClose() {
      this.showEdit = false
      this.loading = true
      this.getArticleList()
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }

  .display_img {
    max-width: 100px;
    max-height: 100px;
    width: auto;
    height: auto;
  }
}
</style>
