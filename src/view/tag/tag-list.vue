<template>
  <div class="container">
    <div class="header">
      <div class="title">标签列表</div>

      <el-button
        style="margin-left: 30px;"
        @click.prevent="handleAdd"
        type="primary"
        plain
        size="medium"
        v-permission="{ permission: '添加标签', type: 'disabled' }"
        >添加标签</el-button
      >
    </div>

    <el-table stripe v-loading="loading" :data="tableData">
      <el-table-column prop="id" label="ID" width="200"></el-table-column>

      <el-table-column prop="name" label="名称" width="200"></el-table-column>

      <el-table-column prop="online" label="状态" min-width="100">
        <template slot-scope="scope">{{ scope.row.online | onlineFormat }}</template>
      </el-table-column>

      <el-table-column fixed="right" width="200" label="操作">
        <template slot-scope="scope">
          <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>

          <el-button
            @click.prevent="handleDelete(scope.row)"
            type="danger"
            plain
            size="mini"
            v-permission="{ permission: '删除标签', type: 'disabled' }"
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

    <!--  添加/更新标签弹窗  -->
    <tag-edit
      v-if="dialogFormVisible"
      :isCreate="isCreate"
      :dialogFormVisible="dialogFormVisible"
      :tagId="tagId"
      @dialogClose="dialogClose"
    ></tag-edit>
  </div>
</template>

<script>
import Tag from '@/model/tag'
import TagEdit from './tag-edit'

export default {
  components: {
    TagEdit,
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      tableData: [],
      tagId: 0,
      totalNums: 0,
      currentPage: 1,
      pageCount: 10,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新 Pagination 组件
      dialogFormVisible: false, // 是否显示添加/更新标签弹窗
      isCreate: false, // 是否显示添加标签弹窗
      form: {
        name: '',
        online: 1,
      },
    }
  },
  async created() {
    this.loading = true
    this.getTagList()
    this.loading = false
  },
  filters: {
    onlineFormat(val) {
      return val === 1 ? '上线' : '下线'
    },
  },
  methods: {
    // 获取标签列表
    async getTagList() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const tagList = await Tag.getTagListByPage(page, count)
      this.tableData = tagList.items
      this.totalNums = tagList.total
    },
    // 切换 table 页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this.getTagList()
      this.loading = false
    },
    // 监听添加标签
    handleAdd() {
      this.dialogFormVisible = true
      this.isCreate = true
    },
    // 监听更新标签
    handleEdit(val) {
      this.tagId = val.id
      this.isCreate = false
      this.dialogFormVisible = true
    },
    // 监听删除标签
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该标签，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Tag.deleteTagById(val.id)
        } catch (e) {
          this.loading = false
          console.error(e)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.loading = false
          if (this.totalNums % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          this.getTagList()
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
    // 监听添加/更新标签弹窗关闭
    dialogClose() {
      this.dialogFormVisible = false
      this.loading = true
      this.getTagList()
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
