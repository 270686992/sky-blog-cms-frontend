<template>
  <div class="container">
    <div class="header">
      <div class="title">友情链接列表</div>

      <el-button
        style="margin-left: 30px;"
        @click.prevent="handleAdd"
        type="primary"
        plain
        size="medium"
        v-permission="{ permission: '添加友情链接', type: 'disabled' }"
      >添加友情链接</el-button>
    </div>

    <el-table stripe v-loading="loading" :data="tableData">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>

      <el-table-column prop="icon" label="图标" width="150">
        <template v-if="scope.row.icon" slot-scope="scope">
          <el-image class="display_img" :src="scope.row.icon" :preview-src-list="imgSrcList"></el-image>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" min-width="100"></el-table-column>

      <el-table-column prop="url" label="URL" min-width="100"></el-table-column>

      <el-table-column prop="priority" label="权重" min-width="100"></el-table-column>

      <el-table-column prop="kind" label="类型" min-width="100">
        <template slot-scope="scope">{{ scope.row.kind | kindFormat }}</template>
      </el-table-column>

      <el-table-column prop="display_state" label="状态" min-width="100">
        <template slot-scope="scope">{{ scope.row.display_state | displayStateFormat }}</template>
      </el-table-column>

      <el-table-column prop="description" label="描述" min-width="100"></el-table-column>

      <el-table-column fixed="right" width="200" label="操作">
        <template slot-scope="scope">
          <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>

          <el-button
            @click.prevent="handleDelete(scope.row)"
            type="danger"
            plain
            size="mini"
            v-permission="{ permission: '删除友情链接', type: 'disabled' }"
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

    <!--  添加/更新友情链接弹窗  -->
    <friend-link-edit
      v-if="dialogFormVisible"
      :isCreate="isCreate"
      :dialogFormVisible="dialogFormVisible"
      :friendLinkId="friendLinkId"
      @dialogClose="dialogClose"
    ></friend-link-edit>
  </div>
</template>

<script>
import FriendLink from '@/model/friend-link'
import FriendLinkEdit from './friend-link-edit'

export default {
  components: {
    FriendLinkEdit,
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      tableData: [],
      friendLinkId: 0,
      imgSrcList: [], // 用于大图预览
      totalNums: 0,
      currentPage: 1,
      pageCount: 10,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新 Pagination 组件
      dialogFormVisible: false, // 是否显示添加/更新友情链接弹窗
      isCreate: false, // 是否显示添加友情链接弹窗
    }
  },
  async created() {
    this.loading = true
    this.getFriendLinkList()
    this.loading = false
  },
  filters: {
    displayStateFormat(val) {
      return val === 1 ? '显示' : '隐藏'
    },
    kindFormat(val) {
      let result
      switch (val) {
        case 0:
          result = '友情链接'
          break
        case 1:
          result = '推荐链接'
          break
        case 2:
          result = '站长个人链接'
          break
        default:
          result = '其他'
          break
      }
      return result
    }
  },
  methods: {
    // 获取友情链接列表
    async getFriendLinkList() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const friendLinkList = await FriendLink.getFriendLinkListByPage(page, count)
      this.tableData = friendLinkList.items
      this.totalNums = friendLinkList.total
      this.initImgSrcList()
    },
    // 切换 table 页
    async handleCurrentChange(val) {
      this.imgSrcList = []
      this.currentPage = val
      this.loading = true
      this.getFriendLinkList()
      this.loading = false
    },
    // 初始化用于大图预览的图片 url 列表
    initImgSrcList() {
      this.tableData.forEach(item => {
        if (!item.icon) {
          return
        }
        this.imgSrcList.push(item.icon)
      })
    },
    // 监听添加友情链接
    handleAdd() {
      this.dialogFormVisible = true
      this.isCreate = true
    },
    // 监听更新友情链接
    handleEdit(val) {
      this.friendLinkId = val.id
      this.isCreate = false
      this.dialogFormVisible = true
    },
    // 监听删除友情链接
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该友情链接，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await FriendLink.deleteFriendLinkById(val.id)
        } catch (e) {
          this.loading = false
          console.error(e)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.loading = false
          if (this.totalNums % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          this.getFriendLinkList()
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
    // 监听添加/更新友情链接弹窗关闭
    dialogClose() {
      this.dialogFormVisible = false
      this.loading = true
      this.getFriendLinkList()
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
