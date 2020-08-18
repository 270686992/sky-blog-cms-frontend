<template>
  <div class="container">
    <div class="header">
      <div class="title">一级评论列表</div>
    </div>

    <el-table stripe v-loading="loading" :data="tableData">
      <el-table-column prop="id" label="ID" min-width="100"></el-table-column>

      <el-table-column prop="article_id" label="所属文章 ID" min-width="100"></el-table-column>

      <el-table-column prop="customer_id" label="所属用户 ID" min-width="100">
        <template slot-scope="scope">{{ scope.row.customer_id | idFormat }}</template>
      </el-table-column>

      <el-table-column label="状态" prop="display_state" min-width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.display_state"
            active-color="#3963bc"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            v-permission="{ permission: '更新文章评论显示状态', type: 'disabled' }"
            @change="handleDisplayState($event, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="ip" label="评论者 IP" min-width="100"></el-table-column>

      <el-table-column prop="address" label="IP 对应位置" :show-overflow-tooltip="true" min-width="100"></el-table-column>

      <el-table-column prop="content" label="评论内容" :show-overflow-tooltip="true" min-width="200"></el-table-column>

      <el-table-column fixed="right" width="220" label="操作">
        <template slot-scope="scope">
          <el-button @click.prevent="handleSubList(scope.row)" type="primary" plain size="mini">子评论</el-button>

          <el-button @click.prevent="handleReply(scope.row)"
                     type="primary"
                     plain
                     size="mini"
          >回复</el-button>

          <el-button
            @click.prevent="handleDelete(scope.row)"
            type="danger"
            plain
            size="mini"
            v-permission="{ permission: '删除文章评论', type: 'disabled' }"
          >删除</el-button>
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

    <!--  回复文章评论弹窗  -->
    <comment-reply
      v-if="dialogFormVisible"
      :dialogFormVisible="dialogFormVisible"
      :commentId="commentId"
      @dialogClose="dialogClose"
    ></comment-reply>
  </div>
</template>

<script>
import Comment from '@/model/comment'
import CommentReply from './comment-reply'

export default {
  components: {
    CommentReply,
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      tableData: [],
      commentId: 0,
      totalNums: 0,
      currentPage: 1,
      pageCount: 10,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新 Pagination 组件
      dialogFormVisible: false, // 是否显示回复文章评论弹窗
      root: 1, // 是否是父评论
    }
  },
  async created() {
    this.loading = true
    this.getCommentList()
    this.loading = false
  },
  filters: {
    idFormat(val) {
      if (val === null || val === 0) {
        return '空'
      }
      return val
    },
  },
  methods: {
    // 获取文章评论列表
    async getCommentList() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const commentList = await Comment.getCommentListByPage(page, count, this.root)
      this.tableData = commentList.items
      this.totalNums = commentList.total
    },
    // 切换 table 页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this.getCommentList()
      this.loading = false
    },
    // 监听评论显示状态更改
    async handleDisplayState(val, rowData) {
      let res
      this.loading = true

      try {
        res = await Comment.updateCommentDisplayStateById(rowData.id, val)
      } catch (e) {
        this.loading = false
        console.error(e)
      }

      if (res.code < window.MAX_SUCCESS_CODE) {
        this.loading = false
        this.$message({
          type: 'success',
          message: `${res.message}`,
        })
      } else {
        this.loading = false
        this.$message.error(`${res.message}`)
      }
    },
    // 监听回复文章评论
    handleReply(val) {
      this.commentId = val.id
      this.dialogFormVisible = true
    },
    // 监听删除文章评论
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该文章评论，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Comment.deleteCommentById(val.id)
        } catch (e) {
          this.loading = false
          console.error(e)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.loading = false
          if (this.totalNums % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          this.getCommentList()
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
    // 监听跳转子评论列表页
    handleSubList(row) {
      this.$router.push({
        path: `/sub-comment/${row.id}/list`,
      })
    },
    // 监听回复文章评论弹窗关闭
    dialogClose() {
      this.dialogFormVisible = false
      this.loading = true
      this.getCommentList()
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
}
</style>
