<template>
  <div>
    <div v-if="!showEdit" class="container">
      <div class="header">
        <div class="title">博客用户列表</div>

        <div class="header-left">
          <lin-search @query="onQueryChange" ref="searchKeyword" />
        </div>
      </div>

      <transition name="fade">
        <div class="search" v-if="keyword">
          <p class="search-tip">
            搜索“<span class="search-keyword">{{ keyword }}</span>”, 找到 <span class="search-num">{{ totalNums }}</span> 条用户信息
          </p>

          <button class="search-back" @click="backInit">返回全部用户</button>
        </div>
      </transition>

      <el-table stripe v-loading="loading" :data="tableData">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>

        <el-table-column prop="avatar" label="头像" width="200">
          <template v-if="scope.row.avatar" slot-scope="scope">
            <img class="display_img" :src="scope.row.avatar" :alt="scope.row.avatar" />
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" width="200"></el-table-column>

        <el-table-column :show-overflow-tooltip="true" prop="nickname" label="昵称" width="200"></el-table-column>

        <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" width="200"></el-table-column>

        <el-table-column label="状态" prop="state" min-width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-color="#3963bc"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              v-permission="{ permission: '更新博客用户状态', type: 'disabled' }"
              @change="handleState($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-button @click.prevent="handleDetail(scope.row)" type="primary" plain size="mini">详情</el-button>

            <el-button disabled @click.prevent="handleDelete()" type="danger" size="mini" plain>删除</el-button>
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
          :total="totalNums"></el-pagination>
      </div>
    </div>

    <customer-detail :userId="userId" @editClose="editClose" v-else></customer-detail>
  </div>
</template>

<script>
import LinSearch from '@/component/base/search/lin-search'
import Customer from '@/model/customer'
import CustomerDetail from './customer-detail'

export default {
  components: {
    LinSearch,
    CustomerDetail,
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      tableData: [], // 表格数据
      userId: 0, // 显示详情的用户的 ID
      showEdit: false, // 是否显示用户详情页
      totalNums: 0, // 数据总数
      keyword: null, // 查询关键字,用于显示搜索提示
      searchKeyword: '', // 搜索时输入的关键字
      currentPage: 1, // 当前页数
      pageCount: 10, // 每页的数据量
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新 Pagination 组件
    }
  },
  async created() {
    this.loading = true
    this.getCustomerList()
    this.loading = false
  },
  watch: {
    /**
     * 关键字搜索
     */
    searchKeyword(newVal) {
      if (newVal) {
        this.keyword = newVal
        if (this.searchUser) {
          this.keyword = `${newVal}`
        }
      } else {
        this.keyword = ''
        this.$refs.searchKeyword.clear()
      }
      this.searchCustomerList()
    },
  },
  methods: {
    /**
     * 获取博客用户列表
     */
    async getCustomerList() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const customerList = await Customer.getCustomerListByPage(page, count)
      this.tableData = customerList.items
      this.totalNums = customerList.total
    },
    /**
     * 通过查询关键字分页搜索博客用户列表
     */
    async searchCustomerList() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const users = await Customer.searchCustomerList({
        page,
        count,
        keyword: this.searchKeyword,
      })
      this.tableData = users.items
      this.totalNums = users.total
    },
    // 监听博客用户状态更改
    async handleState(val, rowData) {
      let res
      this.loading = true

      try {
        res = await Customer.updateCustomerStateById(rowData.id, val)
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
    /**
     * 切换 table 页
     */
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      if (this.searchKeyword.length) {
        this.searchCustomerList()
      } else {
        this.getCustomerList()
      }
      this.loading = false
    },
    /**
     * 监听查看博客用户详情
     */
    handleDetail(val) {
      this.userId = val.id
      this.showEdit = true
    },
    /**
     * 监听博客用户详情页关闭
     */
    editClose() {
      this.showEdit = false
      this.getCustomerList()
    },
    /**
     * 监听删除博客用户
     */
    handleDelete() {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.getCustomerList()
        this.$message({
          type: 'warning',
          message: '不可删除博客用户',
        })
      })
    },
    /**
     * 清空检索
     */
    async backInit() {
      this.searchKeyword = ''
      this.keyword = ''
      this.tableData = []
      this.loading = true
      this.getCustomerList()
      this.loading = false
    },
    /**
     * 监听输入查询关键字
     */
    async onQueryChange(query) {
      this.searchKeyword = query.trim()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      margin-right: 30px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .search {
    height: 52px;
    width: 100%;
    background: rgba(57, 99, 188, 0.1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 24px;
    margin-bottom: 24px;

    .search-tip {
      margin-left: 40px;
      height: 52px;
      line-height: 52px;
      color: #354058;
      font-size: 14px;

      .search-keyword {
        color: $theme;
      }

      .search-num {
        color: #f4516c;
      }
    }

    .search-back {
      margin: 8px 20px;
      height: 32px;
      background: #f4516c;
      border: none;
      border-radius: 2px;
      color: #fff;
      padding: 0 13px;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}

.display_img {
  max-width: 100px;
  max-height: 100px;
  width: auto;
  height: auto;
}
</style>
