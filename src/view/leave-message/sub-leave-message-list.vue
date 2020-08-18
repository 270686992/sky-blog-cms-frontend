<template>
  <div class="container">
    <div class="header">
      <div class="title">二级留言列表</div>
    </div>

    <el-table stripe v-loading="loading" :data="tableData">
      <el-table-column prop="id" label="ID" min-width="100"></el-table-column>

      <el-table-column prop="customer_id" label="所属用户 ID" min-width="100">
        <template slot-scope="scope">{{ scope.row.customer_id | idFormat }}</template>
      </el-table-column>

      <el-table-column prop="admin_user_id" label="所属管理员用户 ID" min-width="120">
        <template slot-scope="scope">{{ scope.row.admin_user_id | idFormat }}</template>
      </el-table-column>

      <el-table-column prop="root_id" label="所属一级留言 ID" min-width="120">
        <template slot-scope="scope">{{ scope.row.root_id | idFormat }}</template>
      </el-table-column>

      <el-table-column prop="parent_id" label="父留言 ID" min-width="100">
        <template slot-scope="scope">{{ scope.row.parent_id | idFormat }}</template>
      </el-table-column>

      <el-table-column label="状态" prop="display_state" min-width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.display_state"
            active-color="#3963bc"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            v-permission="{ permission: '更新留言显示状态', type: 'disabled' }"
            @change="handleDisplayState($event, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="ip" label="留言者 IP" min-width="150"></el-table-column>

      <el-table-column prop="address" label="IP 对应位置" :show-overflow-tooltip="true" min-width="150"></el-table-column>

      <el-table-column prop="content" label="留言/回复内容" :show-overflow-tooltip="true" min-width="200"></el-table-column>

      <el-table-column fixed="right" width="200" label="操作">
        <template slot-scope="scope">
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
            v-permission="{ permission: '删除留言', type: 'disabled' }"
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

    <!--  回复留言弹窗  -->
    <leave-message-reply
      v-if="dialogFormVisible"
      :dialogFormVisible="dialogFormVisible"
      :leaveMessageId="subLeaveMessageId"
      @dialogClose="dialogClose"
    ></leave-message-reply>
  </div>
</template>

<script>
import LeaveMessage from '@/model/leave-message'
import LeaveMessageReply from './leave-message-reply'

export default {
  components: {
    LeaveMessageReply,
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      tableData: [],
      superLeaveMessageId: 0,
      subLeaveMessageId: 0,
      totalNums: 0,
      currentPage: 1,
      pageCount: 10,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新 Pagination 组件
      dialogFormVisible: false, // 是否显示回复留言弹窗
    }
  },
  async created() {
    this.loading = true
    this.superLeaveMessageId = this.$route.params.id
    this.getSubLeaveMessageList()
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
    async getSubLeaveMessageList() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const leaveMessageList = await LeaveMessage.getSubLeaveMessageListByPage(page, count, this.superLeaveMessageId)
      this.tableData = leaveMessageList.items
      this.totalNums = leaveMessageList.total
    },
    // 切换 table 页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this.getSubLeaveMessageList()
      this.loading = false
    },
    // 监听留言显示状态更改
    async handleDisplayState(val, rowData) {
      let res
      this.loading = true

      try {
        res = await LeaveMessage.updateLeaveMessageDisplayStateById(rowData.id, val)
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
    // 监听回复留言
    handleReply(val) {
      this.subLeaveMessageId = val.id
      this.dialogFormVisible = true
    },
    // 监听删除留言
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该留言，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await LeaveMessage.deleteLeaveMessageById(val.id)
        } catch (e) {
          this.loading = false
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.loading = false
          if (this.totalNums % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          this.getSubLeaveMessageList()
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
    // 监听回复留言弹窗关闭
    dialogClose() {
      this.dialogFormVisible = false
      this.loading = true
      this.getSubLeaveMessageList()
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
